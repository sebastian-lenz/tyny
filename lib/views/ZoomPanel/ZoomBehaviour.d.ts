import { Pointer } from '../../core/pointers/Pointer';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { ZoomPanel } from './index';
import type { MaybeNativeEvent, NativeEvent } from '../../core/pointers/PointerBehaviour';
export declare class ZoomBehaviour extends TransformBehaviour<ZoomPanel> {
    allowMoveX: boolean;
    allowMoveY: boolean;
    allowScale: boolean;
    initialPosition: tyny.Point;
    initialScale: number;
    isActive: boolean;
    didTransformChange(positionEpsilon?: number, scaleEpsilon?: number): boolean;
    onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
}
