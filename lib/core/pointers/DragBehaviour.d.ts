import { MaybeNativeEvent, NativeEvent, PointerBehaviour, PointerBehaviourOptions } from './PointerBehaviour';
import type { Pointer } from './Pointer';
import type { View } from '../View';
export declare type DragDirection = 'horizontal' | 'vertical' | 'both';
export declare type DragAxis = 'x' | 'y';
export declare type DragDimension = 'width' | 'height';
export declare type DragWatchMode = 'idle' | 'listening' | 'draging';
export interface DragBehaviourOptions extends PointerBehaviourOptions {
    direction?: DragDirection;
    isDisabled?: boolean;
    threshold?: number;
}
export declare function toAxis(direction: DragDirection): DragAxis;
export declare function toDimension(direction: DragDirection): DragDimension;
export declare class DragBehaviour<TView extends View = View> extends PointerBehaviour<TView> {
    direction: DragDirection;
    isDisabled: boolean;
    threshold: number;
    private _watchMode;
    constructor(view: TView, options?: DragBehaviourOptions);
    protected onDrag(event: NativeEvent, pointer: Pointer): boolean;
    protected onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    protected onDragClick(event: MaybeNativeEvent, pointer: Pointer): void;
    protected onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    protected onAdd(): boolean;
    protected onMove(event: NativeEvent, pointer: Pointer): boolean;
    protected onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
    private setWatchMode;
}
