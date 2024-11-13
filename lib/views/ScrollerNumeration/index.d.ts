import { AbstractNumeration } from '../Numeration/AbstractNumeration';
import { Scroller, ScrollerEventArgs } from '../Scroller';
export interface ItemRect {
    xMax: number;
    yMax: number;
    xMin: number;
    yMin: number;
}
export declare class ScrollerNumeration extends AbstractNumeration {
    epsilon: number;
    height: number;
    rects: Array<ItemRect>;
    targetListeners: Function[] | null;
    width: number;
    get target(): Scroller | null;
    onMeasure(): (() => void) | undefined;
    onScrollChanged(event: CustomEvent<ScrollerEventArgs>): void;
    onTargetChanged(target: Scroller | null): void;
    selectIndex(index: number): void;
    updateSelected(position: tyny.Point): void;
}
