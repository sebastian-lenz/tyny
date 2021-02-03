import { MaybeNativeEvent, NativeEvent, PointerBehaviour, PointerBehaviourOptions } from './PointerBehaviour';
import type { Pointer } from './Pointer';
import type { View } from '../View';
export interface TransformBehaviourOptions extends PointerBehaviourOptions {
}
export declare class TransformBehaviour<TView extends View = View> extends PointerBehaviour<TView> {
    maxPointers: number | undefined;
    minPointers: number;
    protected isActive: boolean;
    protected onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    protected onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    protected onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    protected onAdd(event: NativeEvent, pointer: Pointer): boolean;
    protected onChanged(event: MaybeNativeEvent, pointer: Pointer): void;
    protected onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
}
