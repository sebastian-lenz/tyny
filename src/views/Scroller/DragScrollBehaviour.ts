import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import {
  DragBehaviour,
  DragBehaviourOptions,
} from '../../core/pointers/DragBehaviour';

import type { Pointer } from '../../core/pointers/Pointer';
import type { TweenOptions } from '../../fx/tween';
import type { View } from '../../core';
import type {
  MaybeNativeEvent,
  NativeEvent,
} from '../../core/pointers/PointerBehaviour';

export interface ScrollableView extends View {
  isPositionPaged: boolean;
  position: tyny.Point;
  positionBounds: tyny.BoundingBox;
  clampPosition(value: tyny.Point): tyny.Point;
  toLocalOffset(value: tyny.Point): tyny.Point;
  tweenTo(value: tyny.Point, options: Partial<TweenOptions>): void;
}

export interface DragScrollBehaviourOptions extends DragBehaviourOptions {
  disableWheel?: boolean;
}

export class DragScrollBehaviour<
  TView extends ScrollableView = ScrollableView
> extends DragBehaviour<TView> {
  //
  initialPosition: tyny.Point;
  isDraging: boolean = false;
  protected _preventNextClick: boolean = false;
  protected _listeners: Array<Function> | null;

  constructor(view: TView, options: DragScrollBehaviourOptions) {
    super(view, options);
    this.initialPosition = view.position;

    const listeners = (this._listeners = [
      on(view.el, 'click', this.onViewClick, { capture: true, scope: this }),
    ]);

    if (!options.disableWheel) {
      listeners.push(on(view.el, 'wheel', this.onWheel, { scope: this }));
    }
  }

  // Drag API
  // --------

  protected onDragBegin(event: NativeEvent, pointer: Pointer): boolean {
    const { direction, view } = this;
    stop(view);

    const { xMin, xMax, yMin, yMax } = view.positionBounds;
    const xDiff = Math.max(0, xMax - xMin);
    const yDiff = Math.max(0, yMax - yMin);
    const canScroll =
      (direction !== 'vertical' && xDiff > 0) ||
      (direction !== 'horizontal' && yDiff > 0);

    if (!canScroll) {
      return false;
    }

    this.isDraging = true;
    this.initialPosition = view.position;

    event.preventDefault();
    return true;
  }

  protected onDrag(event: NativeEvent, pointer: Pointer): boolean {
    const { direction, initialPosition, view } = this;
    event.preventDefault();

    const delta = view.toLocalOffset(pointer.delta);
    const { xMin, xMax, yMin, yMax } = view.positionBounds;
    let { x, y } = initialPosition;

    if (direction !== 'vertical') {
      x -= delta.x;
      if (x > xMax) x = xMax + (x - xMax) * 0.5;
      if (x < xMin) x = xMin + (x - xMin) * 0.5;
    }

    if (direction !== 'horizontal') {
      y -= delta.y;
      if (y > yMax) y = yMax + (y - yMax) * 0.5;
      if (y < yMin) y = yMin + (y - yMin) * 0.5;
    }

    view.position = { x, y };
    return true;
  }

  protected onDragEnd(event: MaybeNativeEvent, pointer: Pointer) {
    const { view } = this;
    const velocity = this.getVelocity(pointer);

    this._preventNextClick = true;
    this.isDraging = false;

    if (view.isPositionPaged) {
      const position = view.position;
      position.x += velocity.x * 10;
      position.y += velocity.y * 10;
      view.tweenTo(view.clampPosition(position), { easing: easeOutExpo });
    } else {
      const { xMin, xMax, yMin, yMax } = view.positionBounds;
      momentum(view, {
        position: {
          velocity,
          min: { x: xMin, y: yMin },
          max: { x: xMax, y: yMax },
        },
      });
    }
  }

  // Protected methods
  // -----------------

  protected getVelocity(pointer: Pointer): tyny.Point {
    const { direction, view } = this;
    const { clientX, clientY } = pointer.velocity.get();
    const velocity = { x: 0, y: 0 };

    if (direction !== 'vertical') {
      velocity.x = -clientX;
    }

    if (direction !== 'horizontal') {
      velocity.y = -clientY;
    }

    return view.toLocalOffset(velocity);
  }

  protected onDestroyed() {
    super.onDestroyed();

    if (this._listeners) {
      this._listeners.forEach((off) => off());
      this._listeners = null;
    }
  }

  protected onViewClick(event: Event) {
    if (this._preventNextClick) {
      this._preventNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  protected onWheel(event: WheelEvent) {
    if (this.isDraging || this.isDisabled) {
      return;
    }

    const { direction, view } = this;
    const position = view.position;
    let didUpdate: boolean = false;

    const delta = view.toLocalOffset({
      x: event.deltaX,
      y: event.deltaY,
    });

    if (direction !== 'vertical') {
      position.x += delta.x;
      didUpdate = didUpdate || Math.abs(event.deltaX) > 0;
    }

    if (direction !== 'horizontal') {
      position.y += delta.y;
      didUpdate = didUpdate || Math.abs(event.deltaY) > 0;
    }

    if (didUpdate) {
      event.preventDefault();
    }

    stop(view);
    view.position = view.clampPosition(position);
  }
}
