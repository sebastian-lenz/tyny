import { CollectionView, CollectionViewOptions } from '../CollectionView';
export declare const transistEvent = "tyny:transist";
export interface CycleableViewOptions extends CollectionViewOptions {
    initialIndex?: number;
    isLooped?: boolean;
}
export declare class CycleableView<TTransitionOptions = any, TItem extends HTMLElement = HTMLElement> extends CollectionView<TItem> {
    private _current;
    isLooped: boolean;
    get current(): TItem | null;
    set current(value: TItem | null);
    get currentIndex(): number;
    set currentIndex(value: number);
    get next(): TItem | null;
    get previous(): TItem | null;
    constructor(options?: CycleableViewOptions);
    immediate(value: TItem | null): void;
    normalizeIndex(index: number): number;
    transist(value: TItem | number | null, options?: TTransitionOptions): void;
    protected onConnected(): void;
    protected onTransition(from: TItem | null, to: TItem | null, options?: TTransitionOptions): void;
}
