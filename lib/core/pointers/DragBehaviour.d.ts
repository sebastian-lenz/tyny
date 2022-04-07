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
    watchMode: DragWatchMode;
    constructor(view: TView, options?: DragBehaviourOptions);
    onDrag(event: NativeEvent, pointer: Pointer): boolean;
    onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    onDragClick(event: MaybeNativeEvent, pointer: Pointer): void;
    onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    onAdd(event: NativeEvent, pointer: Pointer): boolean;
    onMove(event: NativeEvent, pointer: Pointer): boolean;
    onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
    setWatchMode(value: DragWatchMode): void;
}
