import { ClickBehaviour } from '../../core/pointers/ClickBehaviour';
import { easeInOutQuad } from '../../fx/easings/easeInOutQuad';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { Effect } from './effects/Effect';
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
import { LoadMode, setChildLoadMode } from '../../utils/views/loadMode';

export interface BrowsableView extends CycleableView {
  onBrowseBegin(event: NativeEvent, pointer: Pointer): boolean;
  onBrowseEnd(event: MaybeNativeEvent, pointer: Pointer): void;
  viewport?: HTMLElement;
}

export interface BrowseBehaviourOptions extends DragBehaviourOptions {
  enabled?: boolean;
  effect?: Effect;
  onBrowseTarget?: (index: number) => number;
}

export class BrowseBehaviour<
  TView extends BrowsableView = BrowsableView
> extends DragBehaviour<TView> {
  effect: Effect;
  enabled: boolean;
  initialOffset: number = 0;
  offset: number | null = null;
  onBrowseTarget?: (index: number) => number;

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
    this.onBrowseTarget = options.onBrowseTarget;
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

      let strength = value - index;
      if (!from) {
        strength = 1 + (strength - 1) * 0.5;
      } else if (!to) {
        strength *= 0.5;
      }

      if (from) setChildLoadMode(from, LoadMode.Visibility);
      if (to) setChildLoadMode(to, LoadMode.Visibility);
      effect.apply(from, to, strength);
    }
  }

  // Drag API
  // --------

  onDragBegin(event: NativeEvent, pointer: Pointer): boolean {
    const { offset, view } = this;
    if (
      view.length < 2 ||
      !view.onBrowseBegin(event, pointer) ||
      !this.enabled
    ) {
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
    const force = this.getForce(pointer);
    const options: Partial<TweenOptions> = {
      easing: Math.abs(force) < 2 ? easeInOutQuad : easeOutExpo,
    };

    let offset = this.getOffsetTarget(force);
    if (this.onBrowseTarget) {
      offset = this.onBrowseTarget(offset);
    }

    ClickBehaviour.tryPreventNextClick(view);

    tween(this, { offset }, options).then(() => {
      this.setOffset(null);
      view.onBrowseEnd(event, pointer);
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
    let target;

    if (force < -5) {
      target = Math.ceil(offset);
    } else if (force > 5) {
      target = Math.floor(offset);
    } else {
      target = Math.round(offset);
    }

    if (!this.view.isLooped) {
      const max = this.view.items.length - 1;
      if (target < 0) target = 0;
      if (target > max) target = max;
    }

    return target;
  }
}
