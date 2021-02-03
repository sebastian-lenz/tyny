import { AbstractNumeration } from '../Numeration/AbstractNumeration';
import { Scroller, ScrollerEventArgs } from '../Scroller';
export interface ItemRect {
    xMax: number;
    yMax: number;
    xMin: number;
    yMin: number;
}
export declare class ScrollerNumeration extends AbstractNumeration {
    private _height;
    private _rects;
    private _targetListeners;
    private _width;
    get target(): Scroller | null;
    protected onMeasure(): (() => void) | undefined;
    protected onScrollChanged(event: CustomEvent<ScrollerEventArgs>): void;
    protected onTargetChanged(target: Scroller | null): void;
    protected selectIndex(index: number): void;
    protected updateSelected(position: tyny.Point): void;
}
