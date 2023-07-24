import { DragDirection } from '../../core/pointers/DragBehaviour';
import { findAll } from '../../utils/dom/node';
import { stop } from '../../fx/dispatcher';
import { transform } from '../../utils/env/transformProps';
import { tween, Tween, TweenOptions } from '../../fx/tween';
import { View, ViewOptions, update, property } from '../../core';

import {
  DragScrollBehaviour,
  DragScrollBehaviourOptions,
  ScrollableView,
} from './DragScrollBehaviour';

const createBounds = () => ({
  xMin: 0,
  xMax: 0,
  yMin: 0,
  yMax: 0,
});

export const scrollerScrollEvent = 'tyny:scrollerScroll';

export interface ScrollerEventArgs {
  target: Scroller;
  position: tyny.Point;
}

export interface ScrollerItem {
  el: HTMLElement;
}

export interface ScrollerOptions extends ViewOptions {
  content?: HTMLElement | string;
  dragOptions?: DragScrollBehaviourOptions;
  direction?: DragDirection;
  itemSelector?: string;
  position?: tyny.Point;
  useContentMargins?: boolean;
  viewport?: HTMLElement | string;
}

export class Scroller<TItem extends ScrollerItem = ScrollerItem>
  extends View
  implements ScrollableView
{
  currentTarget: tyny.Point | null = null;
  currentTween: Tween | null = null;
  use3DTransform: boolean = false;
  readonly direction: DragDirection;
  readonly dragBehaviour: DragScrollBehaviour;
  readonly positionBounds: tyny.BoundingBox = createBounds();
  readonly viewportSize: tyny.Dimensions = { width: 0, height: 0 };
  protected _position: tyny.Point;

  @property({ param: { type: 'element' } })
  content!: HTMLElement | null;

  @property()
  get items() {
    return findAll(this.itemSelector, this.content || this.el).map(
      this.createItem
    );
  }

  @property({ param: { defaultValue: '> *', type: 'string' } })
  itemSelector!: string;

  @property({ param: { defaultValue: true, type: 'bool' } })
  useContentMargins!: boolean;

  @property({ param: { defaultValue: ':scope', type: 'element' } })
  viewport!: HTMLElement | null;

  constructor(options: ScrollerOptions) {
    super(options);

    const { direction = 'both', position = { x: 0, y: 0 } } = options;
    this.direction = direction;
    this._position = { ...position };

    this.dragBehaviour = this.addBehaviour(DragScrollBehaviour, {
      direction,
      ...(options.dragOptions || {}),
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

  createItem(el: HTMLElement): TItem {
    return { el } as any;
  }

  gotoPosition(value: tyny.Point) {
    stop(this);
    this.position = this.clampPosition(value);
  }

  setPosition(value: tyny.Point) {
    const { _position, content, direction, use3DTransform } = this;
    if (direction !== 'vertical') _position.x = value.x;
    if (direction !== 'horizontal') _position.y = value.y;

    if (content) {
      const { x, y } = this.toDisplayOffset(_position);
      if (use3DTranslation) {
        content.style[transform] = `translate3d(${-x}px, ${-y}px, 0)`;
      } else {
        content.style[transform] = `translate(${-x}px, ${-y}px)`;
      }
    }

    this.trigger(scrollerScrollEvent, <ScrollerEventArgs>{
      target: this,
      position: { ..._position },
    });
  }

  toDisplayOffset(value: tyny.Point): tyny.Point {
    return value;
  }

  toLocalOffset(value: tyny.Point): tyny.Point {
    return value;
  }

  tweenTo(position: tyny.Point, options: Partial<TweenOptions> = {}): Tween {
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

    return currentTween;
  }

  @update({ mode: 'read', events: ['resize', 'update'] })
  onMeasure() {
    const { content, useContentMargins, viewport, viewportSize } = this;
    const bounds = this.positionBounds;

    if (!content || !viewport) {
      return;
    }

    const height = (viewportSize.height = viewport.offsetHeight);
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
  onResize() {
    stop(this);
    this.position = this.clampPosition(this.position);
  }
}
