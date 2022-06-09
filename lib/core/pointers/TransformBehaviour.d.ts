import { MaybeNativeEvent, NativeEvent, PointerBehaviour, PointerBehaviourOptions } from './PointerBehaviour';
import type { Pointer } from './Pointer';
import type { View } from '../View';
export interface TransformBehaviourOptions extends PointerBehaviourOptions {
}
export declare class TransformBehaviour<TView extends View = View> extends PointerBehaviour<TView> {
    maxPointers: number | undefined;
    minPointers: number;
    isActive: boolean;
    onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    onAdd(event: NativeEvent, pointer: Pointer): boolean;
    onChanged(event: MaybeNativeEvent, pointer: Pointer): void;
    onMove(event: MaybeNativeEvent, pointer: Pointer): boolean;
    onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
}
