import { CycleableView } from '../CycleableView';
import { View, ViewOptions } from '../../core';
export declare const numerationChangeEvent = "tyny:numerationChange";
export interface AbstractNumerationOptions extends ViewOptions {
    container?: HTMLElement | string;
    itemClass?: string;
    itemTagName?: string;
    selectedItemClass?: string;
    target?: CycleableView | string;
}
export declare abstract class AbstractNumeration extends View {
    container: HTMLElement;
    itemClass: string;
    items: HTMLElement[];
    itemTagName: string;
    selectedItemClass: string;
    selectedRange: tyny.Interval;
    constructor(options?: AbstractNumerationOptions);
    setLength(length: number): this | undefined;
    setSelected(range: tyny.Interval): this;
    setSelectedIndex(index: number): void;
    protected onClick(event: MouseEvent): void;
    protected abstract selectIndex(index: number): void;
}
