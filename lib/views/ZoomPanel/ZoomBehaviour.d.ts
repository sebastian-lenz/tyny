import { Pointer } from '../../core/pointers/Pointer';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { ZoomPanel } from './index';
import { MaybeNativeEvent, NativeEvent } from '../../core/pointers/PointerBehaviour';
export declare class ZoomBehaviour extends TransformBehaviour<ZoomPanel> {
    initialPosition: tyny.Point;
    initialScale: number;
    isActive: boolean;
    protected onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    protected onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    protected onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
}
