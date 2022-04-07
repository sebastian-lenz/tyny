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
    listeners: Array<Function> | null;
    offset: number | null;
    preventNextClick: boolean;
    constructor(view: TView, { enabled, effect, ...options }: BrowseBehaviourOptions);
    setOffset(value: number | null): void;
    onDragBegin(event: NativeEvent, pointer: Pointer): boolean;
    onDrag(event: NativeEvent, pointer: Pointer): boolean;
    onDragEnd(event: MaybeNativeEvent, pointer: Pointer): void;
    getForce(pointer: Pointer): number;
    getOffsetTarget(force: number): number;
    onDestroyed(): void;
    onViewClick(event: Event): void;
}
