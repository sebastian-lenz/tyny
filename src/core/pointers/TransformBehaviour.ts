import { isNumber } from '../../utils/lang/number/isNumber';
import {
  MaybeNativeEvent,
  NativeEvent,
  PointerBehaviour,
  PointerBehaviourOptions,
} from './PointerBehaviour';

import type { Pointer } from './Pointer';
import type { View } from '../View';

export interface TransformBehaviourOptions extends PointerBehaviourOptions {}

export class TransformBehaviour<
  TView extends View = View
> extends PointerBehaviour<TView> {
  //
  maxPointers: number | undefined;
  minPointers: number = 1;

  protected isActive: boolean = false;

  // Transform API
  // -------------

  protected onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean {
    return true;
  }

  protected onTransformBegin(event: NativeEvent, pointer: Pointer): boolean {
    return true;
  }

  protected onTransformEnd(event: MaybeNativeEvent, pointer: Pointer) {}

  // Behaviour API
  // -------------

  protected onAdd(event: NativeEvent, pointer: Pointer): boolean {
    const { isActive: _isActive, maxPointers, minPointers } = this;
    const numPointers = this.pointers.length + 1;

    if (isNumber(maxPointers) && numPointers >= maxPointers) {
      return false;
    } else if (_isActive || numPointers < minPointers) {
      return true;
    }

    return (this.isActive = this.onTransformBegin(event, pointer));
  }

  protected onChanged(event: MaybeNativeEvent, pointer: Pointer): void {
    if (this.isActive && !this.onTransform(event, pointer)) {
      this.removeAllPointers();
    }
  }

  protected onRemove(event: MaybeNativeEvent, pointer: Pointer): void {
    const { isActive: _isActive, minPointers, pointers } = this;
    const numPointers = pointers.length - 1;

    if (_isActive && numPointers < minPointers) {
      this.onTransformEnd(event, pointer);
      this.isActive = false;
    }
  }
}
