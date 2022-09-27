import { HoldBehaviourOptions } from './HoldBehaviour';
import { View, ViewOptions } from '../../core';
import { Scroller } from '../Scroller';
import { DragDirection } from '../../core/pointers/DragBehaviour';
export interface ScrollerArrowsOptions extends ViewOptions {
    backward?: string | HTMLElement;
    direction?: DragDirection;
    forward?: string | HTMLElement;
    hold?: HoldBehaviourOptions;
    target?: Scroller | string;
}
export declare class ScrollerArrows extends View {
    protected _targetListeners: Function[] | null;
    direction: DragDirection;
    backward: HTMLButtonElement;
    forward: HTMLButtonElement;
    constructor(options: ScrollerArrowsOptions);
    get target(): Scroller | null;
    protected onScrollerChanged(): void;
    protected onTargetChanged(target: Scroller | null): void;
}
