import { easeInOutQuad } from '../../fx/easings/easeInOutQuad';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { Effect } from './effects/Effect';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import { SlideEffect } from './effects/SlideEffect';
import { tween, TweenOptions } from '../../fx/tween';
import {
  DragBehaviour,
  DragBehaviourOptions,
} from '../../core/pointers/DragBehaviour';

import type { CycleableView } from '../CycleableView';
import type { Pointer } from '../../core/pointers/Pointer';
import type {
  MaybeNativeEvent,
  NativeEvent,
} from '../../core/pointers/PointerBehaviour';

export interface BrowsableView extends CycleableView {
  onBrowseBegin(): boolean;
  onBrowseEnd(): void;
  viewport?: HTMLElement;
}

export interface BrowseBehaviourOptions extends DragBehaviourOptions {
  enabled?: boolean;
  effect?: Effect;
}

export class BrowseBehaviour<
  TView extends BrowsableView = BrowsableView
> extends DragBehaviour<TView> {
  //
  effect: Effect;
  enabled: boolean;
  initialOffset: number = 0;
  listeners: Array<Function> | null;
  offset: number | null = null;
  preventNextClick: boolean = false;

  constructor(
    view: TView,
    {
      enabled = true,
      effect = new SlideEffect(),
      ...options
    }: BrowseBehaviourOptions
  ) {
    super(view, {
      direction: 'horizontal',
      ...options,
    });

    this.enabled = enabled;
    this.effect = effect;
    this.listeners = [
      on(view.el, 'click', this.onViewClick, { capture: true, scope: this }),
    ];
  }

  setOffset(value: number | null) {
    const { effect, offset, view } = this;
    if (offset === value) {
      return;
    }

    this.offset = value;

    if (value === null) {
      effect.clear();
    } else {
      const index = value !== null ? Math.floor(value) : Number.NaN;
      const from = view.at(view.normalizeIndex(index));
      const to = view.at(view.normalizeIndex(index + 1));
      effect.apply(from, to, value - index);
    }
  }

  // Drag API
  // --------

  onDragBegin(event: NativeEvent, pointer: Pointer): boolean {
    const { offset, view } = this;
    if (view.length < 2 || !view.onBrowseBegin() || !this.enabled) {
      return false;
    }

    this.initialOffset = offset === null ? view.currentIndex : offset;
    this.setOffset(this.initialOffset);

    stop(view);
    stop(this);
    view.immediate(null);

    if (!this.usePassiveEvents) event.preventDefault();
    return true;
  }

  onDrag(event: NativeEvent, pointer: Pointer): boolean {
    const { direction, initialOffset, view } = this;
    const { viewport = view.el } = view;
    if (!this.usePassiveEvents) event.preventDefault();

    const delta = pointer.delta;
    let offset = initialOffset;

    if (direction === 'horizontal') {
      offset -= delta.x / viewport.clientWidth;
    } else {
      offset -= delta.y / viewport.clientHeight;
    }

    this.setOffset(offset);
    return true;
  }

  onDragEnd(event: MaybeNativeEvent, pointer: Pointer) {
    const { view } = this;
    this.preventNextClick = true;

    const force = this.getForce(pointer);
    const offset = this.getOffsetTarget(force);
    const options: Partial<TweenOptions> = {
      easing: Math.abs(force) < 2 ? easeInOutQuad : easeOutExpo,
    };

    tween(this, { offset }, options).then(() => {
      this.setOffset(null);
      view.onBrowseEnd();
      view.immediate(view.at(view.normalizeIndex(offset)));
    });
  }

  // methods
  // -----------------

  getForce(pointer: Pointer): number {
    const { clientX, clientY } = pointer.velocity.get();
    return this.direction === 'horizontal' ? clientX : clientY;
  }

  getOffsetTarget(force: number): number {
    const offset = this.offset || 0;

    if (force < -5) {
      return Math.ceil(offset);
    } else if (force > 5) {
      return Math.floor(offset);
    }

    return Math.round(offset);
  }

  onDestroyed() {
    super.onDestroyed();

    if (this.listeners) {
      this.listeners.forEach((off) => off());
      this.listeners = null;
    }
  }

  onViewClick(event: Event) {
    if (this.preventNextClick) {
      this.preventNextClick = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
