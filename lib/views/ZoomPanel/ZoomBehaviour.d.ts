import { Pointer } from '../../core/pointers/Pointer';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { ZoomPanel } from './index';
import { MaybeNativeEvent, NativeEvent } from '../../core/pointers/PointerBehaviour';
export declare class ZoomBehaviour extends TransformBehaviour<ZoomPanel> {
    initialPosition: tyny.Point;
    initialScale: number;
    isActive: boolean;
    onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
}
