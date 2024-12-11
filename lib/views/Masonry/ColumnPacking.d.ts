import { Column, ColumnRegion } from './Column';
import type { Masonry, MasonryStrategy } from './index';
export type ColumnCount = number | {
    (masonry: Masonry): number;
};
export interface ColumnPackingOptions {
    columnCount: ColumnCount;
    gutter?: number;
}
export interface ColumnPackingItem {
    el: HTMLElement;
    style: Partial<CSSStyleDeclaration>;
}
export declare class ColumnPacking implements MasonryStrategy {
    columnCount: ColumnCount;
    gutter: number;
    protected columns: Column[];
    protected columnWidth: number;
    protected height: number;
    protected items: ColumnPackingItem[];
    protected masonry: Masonry | null;
    protected width: number;
    constructor({ columnCount, gutter }: ColumnPackingOptions);
    apply(): Function[];
    setMasonry(value: Masonry | null): void;
    protected findPosition(el: HTMLElement): ColumnRegion | null;
    protected getColumnCount(masonry: Masonry): number;
    protected getColumnsFromWidth(width: number): number;
    protected getMaxHeight(): number;
    protected place(el: HTMLElement): ColumnPackingItem;
    private reset;
}
