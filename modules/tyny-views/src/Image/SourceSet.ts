/**
 * A regular expression used to parse string source sets.
 */
const sourceSetRegExp = /([^ ]+) (\d+)([WwXx])/;

/**
 * Type definition for all applicable SourceSet constructor arguments.
 */
export type SourceSetSource = string | Source[] | SourceSetMode;

/**
 * Defines all available source set modes.
 */
export enum SourceSetMode {
  Width,
  Density,
}

/**
 * Data structure used to store individual sources.
 */
export interface Source {
  /**
   * The image source identifier.
   */
  src: string;

  /**
   * The relevant width or pixel density bias.
   */
  bias?: number;

  /**
   * The desired bias mode.
   */
  mode?: SourceSetMode;
}

export interface SafeSource extends Source {
  bias: number;
}

/**
 * Stores a set of image source definitions.
 */
export default class SourceSet {
  /**
   * The list of source definitions within this set.
   */
  sources: SafeSource[] = [];

  /**
   * The mode used to determine the current source.
   */
  mode: SourceSetMode | undefined;

  /**
   * SourceSet constructor.
   *
   * @param data
   *   A source set string, an array of IImageSource objects or the desired source mode.
   */
  constructor(data?: SourceSetSource) {
    if (Array.isArray(data)) {
      data.forEach(source => this.add(source));
    } else if (typeof data === 'number') {
      this.mode = data;
    } else if (typeof data === 'string') {
      this.parse(data);
    }
  }

  /**
   * Parse the given source set string.
   *
   * @param str
   *   A string containing a source set definition.
   */
  parse(str: string) {
    const sources = str.split(/,/);

    sources.forEach(src => {
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

  /**
   * Add a source definition to this set.
   *
   * @param source
   *   The source definition that should be added.
   */
  add(source: Source) {
    const { mode: currentMode, sources } = this;
    let safeSource: SafeSource = {
      bias: Number.MAX_VALUE,
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

  /**
   * Return the matching source for the given element.
   *
   * @param el
   *   The element whose dimensions should be used to determine the source.
   * @returns
   *   The best matching source identifier.
   */
  get(width: number): string {
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
      if (source.bias >= threshold) return source.src;
    }

    return sources[count - 1].src;
  }
}
