import {
  MaybeNativeEvent,
  NativeEvent,
  PointerBehaviour,
  PointerBehaviourOptions,
} from './PointerBehaviour';

import type { Pointer } from './Pointer';
import type { View } from '../View';

export type DragDirection = 'horizontal' | 'vertical' | 'both';
export type DragAxis = 'x' | 'y';
export type DragDimension = 'width' | 'height';

export type DragWatchMode = 'idle' | 'listening' | 'draging';

export interface DragBehaviourOptions extends PointerBehaviourOptions {
  direction?: DragDirection;
  isDisabled?: boolean;
  threshold?: number;
}

export function toAxis(direction: DragDirection): DragAxis {
  return direction === 'horizontal' ? 'x' : 'y';
}

export function toDimension(direction: DragDirection): DragDimension {
  return direction === 'horizontal' ? 'width' : 'height';
}

export class DragBehaviour<
  TView extends View = View
> extends PointerBehaviour<TView> {
  //
  direction: DragDirection;
  isDisabled: boolean;
  threshold: number;
  watchMode: DragWatchMode = 'idle';

  constructor(view: TView, options: DragBehaviourOptions = {}) {
    super(view, options);

    const { direction = 'both', isDisabled = false, threshold = 3 } = options;
    this.direction = direction;
    this.isDisabled = isDisabled;
    this.threshold = threshold;
  }

  // Drag API
  // --------

  onDrag(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  onDragBegin(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  onDragClick(event: MaybeNativeEvent, pointer: Pointer) {}

  onDragEnd(event: MaybeNativeEvent, pointer: Pointer) {}

  // Behaviour API
  // -------------

  onAdd(event: NativeEvent, pointer: Pointer): boolean {
    if (this.isDisabled || this.watchMode !== 'idle') {
      return false;
    }

    this.watchMode = 'listening';
    return true;
  }

  onMove(event: NativeEvent, pointer: Pointer): boolean {
    const { watchMode: _watchMode } = this;
    if (_watchMode === 'listening') {
      const { direction, threshold } = this;
      if (pointer.deltaLength < threshold) {
        return true;
      }

      const { x, y } = pointer.delta;
      if (
        (direction === 'horizontal' && Math.abs(x) < Math.abs(y)) ||
        (direction === 'vertical' && Math.abs(x) > Math.abs(y)) ||
        !this.onDragBegin(event, pointer)
      ) {
        this.setWatchMode('idle');
        return false;
      }

      pointer.resetInitialPosition();
      this.setWatchMode('draging');
    }

    if (_watchMode === 'draging') {
      if (!this.onDrag(event, pointer)) {
        this.setWatchMode('idle');
        return false;
      }
    }

    return true;
  }

  onRemove(event: MaybeNativeEvent, pointer: Pointer): void {
    const { watchMode: _watchMode } = this;
    this.setWatchMode('idle');

    if (_watchMode === 'draging') {
      this.onDragEnd(event, pointer);
    } else if (_watchMode === 'listening') {
      this.onDragClick(event, pointer);
    }
  }

  setWatchMode(value: DragWatchMode) {
    const { watchMode: _watchMode } = this;
    if (_watchMode === value) return;
    this.watchMode = value;
  }
}
