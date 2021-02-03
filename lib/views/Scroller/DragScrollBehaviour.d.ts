import { DragBehaviour, DragBehaviourOptions } from '../../core/pointers/DragBehaviour';
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
    protected _preventNextClick: boolean;
    protected _listeners: Array<Function> | null;
    constructor(view: TView, options: DragScrollBehaviourOptions);
    protected onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    protected onDrag(event: NativeEvent, pointer: Pointer): boolean;
    protected onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    protected getVelocity(pointer: Pointer): tyny.Point;
    protected onDestroyed(): void;
    protected onViewClick(event: Event): void;
    protected onWheel(event: WheelEvent): void;
}
