import { View, ViewOptions } from '../../core';
export declare const collectionChangedEvent = "tyny:collectionChanged";
export interface CollectionViewOptions extends ViewOptions {
    itemSelector?: string;
}
export interface CollectionViewEventArgs<TItem extends HTMLElement = HTMLElement> {
    items: TItem[];
    target: CollectionView<TItem>;
}
export declare class CollectionView<TItem extends HTMLElement = HTMLElement> extends View {
    itemSelector: string;
    get items(): TItem[];
    get length(): number;
    constructor(options?: CollectionViewOptions);
    at(index: number): TItem | null;
    contains(item: TItem): boolean;
    indexOf(item: TItem): number;
    protected onItemsChanged(items: TItem[]): void;
}
