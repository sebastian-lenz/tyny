import { attr } from '../../utils/dom/attr';
import { LoadMode, LoadModeView } from '../../utils/views/loadMode';
import { once } from '../../utils/dom/event/once';
import { property, update, View, ViewOptions } from '../../core';
import { SourceSet } from './SourceSet';
import { toInt } from '../../utils/lang/number/toInt';
import { visibility, VisibilityTarget } from '../../services/visibility';

export interface ImageOptions extends ViewOptions {
  sourceSet?: SourceSet | string;
}

export class Image extends View implements LoadModeView, VisibilityTarget {
  readonly el!: HTMLImageElement;
  currentSource: string = '';
  displayHeight: number = 0;
  displayWidth: number = 0;
  isLoaded: boolean = false;
  isVisible: boolean = false;
  loadMode: LoadMode = LoadMode.Visibility;
  naturalHeight: number = 0;
  naturalWidth: number = 0;

  @property({ immutable: true })
  get promise(): Promise<void> {
    return new Promise<void>((resolve) => {
      const { el } = this;
      const hasSrc = el.hasAttribute('src') || el.hasAttribute('srcset');
      if (hasSrc && el.complete) {
        resolve();
      } else {
        once(el, 'load', resolve);
      }
    }).then(() => {
      const { el } = this;
      el.classList.add('loaded');

      this.isLoaded = true;
      if (el.naturalHeight !== 0 && el.naturalWidth !== 0) {
        this.naturalHeight = el.naturalHeight;
        this.naturalWidth = el.naturalWidth;
      }
    });
  }

  @property({
    immutable: true,
    param: { ctor: SourceSet, type: 'instance', attribute: 'data-srcset' },
  })
  sourceSet!: SourceSet;

  constructor(options: ImageOptions = {}) {
    super(options);

    this.naturalHeight = toInt(attr(this.el, 'height'));
    this.naturalWidth = toInt(attr(this.el, 'width'));
    this.loadMode = this.params.enum({
      defaultValue: LoadMode.Visibility,
      enum: LoadMode,
      name: 'loadMode',
    });
  }

  load(): Promise<void> {
    this.loadMode = LoadMode.Always;
    this.update();

    return this.promise;
  }

  setLoadMode(value: LoadMode) {
    if (this.loadMode === value) return;
    this.loadMode = value;

    if (value === LoadMode.Visibility) {
      this.update();
    }
  }

  setSource(value: string) {
    if (this.currentSource === value) return;
    this.currentSource = value;
    this.promise;

    this.el.src = value;
  }

  setVisible(value: boolean) {
    this.isVisible = value;
    if (value) this.update();
  }

  update() {
    const { displayWidth, sourceSet } = this;
    if (this.allowLoad()) {
      sourceSet.get(displayWidth).then((source) => this.setSource(source));
    }
  }

  allowLoad() {
    if (this.loadMode === LoadMode.Visibility) {
      return this.isVisible;
    }

    return this.loadMode === LoadMode.Always;
  }

  onConnected() {
    super.onConnected();
    visibility.observe(this);
  }

  onDisconnected() {
    super.onDisconnected();
    visibility.unobserve(this);
  }

  @update({ events: ['resize', 'update'], mode: 'read' })
  onResize() {
    const { displayHeight, displayWidth, el } = this;
    const height = (this.displayHeight = el.clientHeight);
    const width = (this.displayWidth = el.clientWidth);

    if (displayHeight !== height || displayWidth !== width) {
      return this.update;
    }
  }
}
