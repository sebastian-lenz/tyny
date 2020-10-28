import { DragDirection } from '../../core/pointers/DragBehaviour';
import { DragScrollBehaviour, ScrollableView } from './DragScrollBehaviour';
import { stop } from '../../fx/dispatcher';
import { transform } from '../../utils/env/transformProps';
import { tween, Tween, TweenOptions } from '../../fx/tween';
import { View, ViewOptions, update, property } from '../../core';

const createBounds = () => ({
  xMin: 0,
  xMax: 0,
  yMin: 0,
  yMax: 0,
});

export interface ScrollerOptions extends ViewOptions {
  content?: HTMLElement | string;
  direction?: DragDirection;
  position?: tyny.Point;
  useContentMargins?: boolean;
  viewport?: HTMLElement | string;
}

export class Scroller extends View implements ScrollableView {
  currentTarget: tyny.Point | null = null;
  currentTween: Tween | null = null;
  readonly dragBehaviour: DragScrollBehaviour;
  readonly positionBounds: tyny.BoundingBox = createBounds();
  readonly viewportSize: tyny.Dimensions = { width: 0, height: 0 };
  protected _position: tyny.Point;

  @property({ param: { type: 'element' } })
  content!: HTMLElement | null;

  @property({ param: { defaultValue: true, type: 'bool' } })
  useContentMargins!: boolean;

  @property({ param: { defaultValue: ':scope', type: 'element' } })
  viewport!: HTMLElement | null;

  constructor(options: ScrollerOptions) {
    super(options);

    const { direction = 'both', position = { x: 0, y: 0 } } = options;
    this._position = { ...position };

    this.dragBehaviour = this.addBehaviour(DragScrollBehaviour, {
      direction,
      view: this,
    });
  }

  get isPositionPaged(): boolean {
    return false;
  }

  get position(): tyny.Point {
    const { x, y } = this._position;
    return { x, y };
  }

  set position(value: tyny.Point) {
    this.setPosition(value);
  }

  clampPosition(value: tyny.Point): tyny.Point {
    const { xMin, xMax, yMin, yMax } = this.positionBounds;
    let { x, y } = value;

    if (x > xMax) x = xMax;
    if (x < xMin) x = xMin;
    if (y > yMax) y = yMax;
    if (y < yMin) y = yMin;

    return { x, y };
  }

  gotoPosition(value: tyny.Point) {
    stop(this);
    this.position = this.clampPosition(value);
  }

  setPosition(value: tyny.Point) {
    const { content } = this;
    const { x, y } = this.toDisplayOffset(value);
    this._position.x = value.x;
    this._position.y = value.y;

    if (content) {
      (<any>content.style)[transform] = `translate(${-x}px, ${-y}px)`;
    }
  }

  toDisplayOffset(value: tyny.Point): tyny.Point {
    return value;
  }

  toLocalOffset(value: tyny.Point): tyny.Point {
    return value;
  }

  tweenTo(position: tyny.Point, options: Partial<TweenOptions>): void {
    let { currentTween } = this;
    this.currentTarget = position;

    if (currentTween) {
      currentTween.advance({ position }, options);
    } else {
      this.currentTween = currentTween = tween(
        this,
        { position },
        { ...options, rejectOnStop: true }
      );

      const reset = () => (this.currentTween = this.currentTarget = null);
      currentTween.then(reset, reset);
    }
  }

  // Protected methods
  // -----------------

  @update({ mode: 'read', events: ['resize', 'update'] })
  protected onMeasure() {
    const { content, useContentMargins, viewport, viewportSize } = this;
    const bounds = this.positionBounds;

    if (!content || !viewport) {
      return;
    }

    const height = (viewportSize.width = viewport.offsetHeight);
    const width = (viewportSize.width = viewport.offsetWidth);

    bounds.xMin = 0;
    bounds.xMax = content.scrollWidth - width;
    bounds.yMin = 0;
    bounds.yMax = content.scrollHeight - height;

    if (useContentMargins) {
      const style = window.getComputedStyle(content);
      bounds.xMax +=
        parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      bounds.yMax +=
        parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }
  }

  @update({ mode: 'write', events: 'resize' })
  protected onResize() {
    stop(this);
    this.position = this.clampPosition(this.position);
  }
}
