import { Effect } from './effects/Effect';
import { DragBehaviour, DragBehaviourOptions } from '../../core/pointers/DragBehaviour';
import type { CycleableView } from '../CycleableView';
import type { Pointer } from '../../core/pointers/Pointer';
import type { MaybeNativeEvent, NativeEvent } from '../../core/pointers/PointerBehaviour';
export interface BrowsableView extends CycleableView {
    onBrowseBegin(): boolean;
    onBrowseEnd(): void;
    viewport?: HTMLElement;
}
export interface BrowseBehaviourOptions extends DragBehaviourOptions {
    enabled?: boolean;
    effect?: Effect;
}
export declare class BrowseBehaviour<TView extends BrowsableView = BrowsableView> extends DragBehaviour<TView> {
    effect: Effect;
    enabled: boolean;
    initialOffset: number;
    offset: number | null;
    protected _preventNextClick: boolean;
    protected _listeners: Array<Function> | null;
    constructor(view: TView, { enabled, effect, ...options }: BrowseBehaviourOptions);
    setOffset(value: number | null): void;
    protected onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    protected onDrag(event: NativeEvent, pointer: Pointer): boolean;
    protected onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    protected getForce(pointer: Pointer): number;
    protected getOffsetTarget(force: number): number;
    protected onDestroyed(): void;
    protected onViewClick(event: Event): void;
}
