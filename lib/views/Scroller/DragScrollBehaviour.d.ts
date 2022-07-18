import { DragBehaviour } from '../../core/pointers/DragBehaviour';
import type { DragBehaviourOptions } from '../../core/pointers/DragBehaviour';
import type { Pointer } from '../../core/pointers/Pointer';
import type { TweenOptions } from '../../fx/tween';
import type { View } from '../../core';
import type { MaybeNativeEvent, NativeEvent } from '../../core/pointers/PointerBehaviour';
export interface ScrollableView extends View {
    isPositionPaged: boolean;
    position: tyny.Point;
    positionBounds: tyny.BoundingBox;
    clampPosition(value: tyny.Point): tyny.Point;
    toLocalOffset(value: tyny.Point): tyny.Point;
    tweenTo(value: tyny.Point, options: Partial<TweenOptions>): void;
}
export interface DragScrollBehaviourOptions extends DragBehaviourOptions {
    disableWheel?: boolean;
}
export declare class DragScrollBehaviour<TView extends ScrollableView = ScrollableView> extends DragBehaviour<TView> {
    initialPosition: tyny.Point;
    isDraging: boolean;
    listeners: Array<Function> | null;
    constructor(view: TView, options: DragScrollBehaviourOptions);
    onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    onDrag(event: NativeEvent, pointer: Pointer): boolean;
    onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    getVelocity(pointer: Pointer): tyny.Point;
    onDestroyed(): void;
    onWheel(event: WheelEvent): void;
}
