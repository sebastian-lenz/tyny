import { View, ViewOptions } from 'tyny';
import { BoundingBoxType, PointType, transformProps } from 'tyny-utils';
import { animate, stop, tween, Tween, TweenOptions } from 'tyny-fx';

import ScrollBehaviour, { ScrollableView } from './ScrollBehaviour';

export interface ScrollerOptions extends ViewOptions {
  content: HTMLElement | string;
  direction: 'horizontal' | 'vertical' | 'both';
  initialPosition?: PointType;
  viewport?: HTMLElement | string;
}

export default class Scroller extends View implements ScrollableView {
  behaviour: ScrollBehaviour;
  content: HTMLElement;
  currentTarget: PointType | null = null;
  currentTween: Tween | null = null;
  position: PointType;
  viewport: HTMLElement;

  constructor(options: ScrollerOptions) {
    super(options);

    const args = this.createArgs(options);
    const { direction = 'both', initialPosition = { x: 0, y: 0 } } = options;

    this.content = args.element({ name: 'content' }) || this.element;
    this.position = initialPosition;
    this.viewport = args.element({ name: 'viewport' }) || this.element;

    this.getComponentNode().setResizeHandler(this.handleResize);

    this.behaviour = new ScrollBehaviour({
      direction,
      view: this,
    });
  }

  clampPosition(value: PointType): PointType {
    const { xMin, xMax, yMin, yMax } = this.getPositionBounds();
    let { x, y } = value;

    if (x < xMin) x = xMin;
    if (x > xMax) x = xMax;
    if (y < yMin) y = yMin;
    if (y > yMax) y = yMax;

    return { x, y };
  }

  getPosition(): PointType {
    const { x, y } = this.position;
    return { x, y };
  }

  getPositionBounds(): BoundingBoxType {
    const { content, viewport } = this;
    return {
      xMin: 0,
      xMax: content.scrollWidth - viewport.offsetWidth,
      yMin: 0,
      yMax: content.scrollHeight - viewport.offsetHeight,
    };
  }

  isPositionPaged(): boolean {
    return false;
  }

  setPosition(value: PointType): void {
    const { content } = this;
    const { x, y } = this.toDisplayOffset(value);
    const { transform } = transformProps();

    (<any>content.style)[transform] = `translate(${-x}px, ${-y}px)`;

    this.position.x = value.x;
    this.position.y = value.y;
  }

  toDisplayOffset(value: PointType): PointType {
    return value;
  }

  toLocalOffset(value: PointType): PointType {
    return value;
  }

  tweenTo(position: PointType, options: Partial<TweenOptions>): void {
    let { currentTween } = this;
    this.currentTarget = position;

    if (currentTween) {
      currentTween.advance({ position }, options);
    } else {
      currentTween = tween(
        this,
        { position },
        { ...options, rejectOnStop: true }
      );

      this.currentTween = currentTween;
      currentTween.then(
        () => (this.currentTween = this.currentTarget = null),
        () => (this.currentTween = this.currentTarget = null)
      );
    }
  }

  handleResize() {
    stop(this);
    this.setPosition(this.clampPosition(this.getPosition()));
  }
}
