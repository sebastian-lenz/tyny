import { supportsWebp } from '../../utils/env/webp';

const sourceSetRegExp = /([^ ]+) (\d+)([WwXx])/;

export type SourceSetSource = string | Source[] | SourceSetMode;

export enum SourceSetMode {
  Width,
  Density,
}

export interface Source {
  bias?: number;
  mode?: SourceSetMode;
  src: string;
}

export interface SafeSource extends Source {
  bias: number;
  isWebp: boolean;
}

export class SourceSet {
  mode: SourceSetMode | null = null;
  sources: SafeSource[] = [];
  webpCheck: Promise<void>;

  constructor(data?: SourceSetSource) {
    if (Array.isArray(data)) {
      data.forEach((source) => this.add(source));
    } else if (typeof data === 'number') {
      this.mode = data;
    } else if (typeof data === 'string') {
      this.parse(data);
    }

    this.webpCheck = this.sources.some((source) => source.isWebp)
      ? supportsWebp().then((hasWebp) => {
          if (!hasWebp) {
            this.sources = this.sources.filter((source) => !source.isWebp);
          }
        })
      : Promise.resolve();
  }

  add(source: Source) {
    const { mode: currentMode, sources } = this;
    let safeSource: SafeSource = {
      bias: Number.MAX_VALUE,
      isWebp: /\.webp$/.test(source.src),
      ...source,
    };

    const { mode } = safeSource;
    if (mode != void 0) {
      if (!currentMode) {
        this.mode = mode;
      } else if (currentMode !== mode) {
        console.warn(
          'Mismatched image srcSet, all sources must use same mode.'
        );
        return;
      }
    }

    sources.push(safeSource);
    sources.sort((a, b) => a.bias - b.bias);
  }

  get(width: number): Promise<string> {
    return this.webpCheck.then(() => {
      const { mode, sources } = this;
      const count = sources.length;
      if (count === 0) {
        return '';
      }

      let threshold = window.devicePixelRatio ? window.devicePixelRatio : 1;
      if (mode === SourceSetMode.Width) {
        threshold = width * threshold;
      }

      for (let index = 0; index < sources.length; index++) {
        const source = sources[index];
        if (source.bias >= threshold) {
          return source.src;
        }
      }

      return sources[count - 1].src;
    });
  }

  parse(rawValue: string) {
    rawValue.split(/,/).forEach((src) => {
      src = src.trim();
      const match = sourceSetRegExp.exec(src);

      if (match) {
        this.add({
          src: match[1],
          bias: parseFloat(match[2]),
          mode:
            match[3] === 'W' || match[3] === 'w'
              ? SourceSetMode.Width
              : SourceSetMode.Density,
        });
      } else {
        this.add({ src });
      }
    });
  }
}
