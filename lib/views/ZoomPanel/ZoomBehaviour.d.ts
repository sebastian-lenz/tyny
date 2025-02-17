import { Pointer } from '../../core/pointers/Pointer';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { ZoomPanel } from './index';
import type { MaybeNativeEvent, NativeEvent, PointerBehaviourOptions } from '../../core/pointers/PointerBehaviour';
export interface ZoomBehaviourOptions extends PointerBehaviourOptions {
    enabled?: boolean;
}
export declare class ZoomBehaviour extends TransformBehaviour<ZoomPanel> {
    allowMoveX: boolean;
    allowMoveY: boolean;
    allowScale: boolean;
    enabled: boolean;
    initialPosition: tyny.Point;
    initialScale: number;
    isActive: boolean;
    onClick?: VoidFunction;
    constructor(view: ZoomPanel, options?: ZoomBehaviourOptions);
    didTransformChange(positionEpsilon?: number, scaleEpsilon?: number): boolean;
    onTransformBegin(event: NativeEvent, pointer: Pointer): boolean;
    onTransform(event: MaybeNativeEvent, pointer: Pointer): boolean;
    onTransformEnd(event: MaybeNativeEvent, pointer: Pointer): void;
}
