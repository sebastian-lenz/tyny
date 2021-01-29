import { property, update, View, ViewOptions } from '../../core';
import { once } from '../../utils/dom/event/once';
import { SourceSet } from './SourceSet';
import { visibility, VisibilityTarget } from '../../services/visibility';
import { attr } from '../../utils/dom/attr';
import { toInt } from '../../utils/lang/number/toInt';

export interface ImageOptions extends ViewOptions {
  sourceSet?: SourceSet | string;
}

export class Image extends View implements VisibilityTarget {
  readonly el!: HTMLImageElement;
  currentSource: string = '';
  displayHeight: number = 0;
  displayWidth: number = 0;
  isLoaded: boolean = false;
  isVisible: boolean = false;
  naturalHeight: number = 0;
  naturalWidth: number = 0;

  @property({ immutable: true })
  get promise(): Promise<void> {
    return new Promise<void>((resolve) => {
      const { el } = this;
      el.complete ? resolve() : once(el, 'load', () => resolve());
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
  }

  load(): Promise<void> {
    this.isVisible = true;
    this.update();

    return this.promise;
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
    const { displayWidth, isVisible, sourceSet } = this;
    if (isVisible) {
      sourceSet.get(displayWidth).then((source) => this.setSource(source));
    }
  }

  protected onConnected() {
    super.onConnected();
    visibility.observe(this);
  }

  protected onDisconnected() {
    super.onDisconnected();
    visibility.unobserve(this);
  }

  @update({ events: ['resize', 'update'], mode: 'read' })
  protected onResize() {
    const { displayHeight, displayWidth, el } = this;
    const height = (this.displayHeight = el.clientHeight);
    const width = (this.displayWidth = el.clientWidth);

    if (displayHeight !== height || displayWidth !== width) {
      return this.update;
    }
  }
}
