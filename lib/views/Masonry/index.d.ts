import { CollectionView, CollectionViewOptions } from '../CollectionView';
export interface MasonryOptions extends CollectionViewOptions {
    strategy?: MasonryStrategy;
}
export interface MasonryStrategy {
    apply(): Function[];
    setMasonry(value: Masonry | null): void;
}
export declare class Masonry<TItem extends HTMLElement = HTMLElement> extends CollectionView<TItem> {
    protected _strategy: MasonryStrategy | null;
    constructor(options?: MasonryOptions);
    get container(): HTMLElement;
    get strategy(): MasonryStrategy | null;
    set strategy(value: MasonryStrategy | null);
    protected onMeasure(): (() => void) | undefined;
}
