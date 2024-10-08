export declare enum LoadMode {
    Always = 0,
    Explicit = 1,
    Visibility = 2
}
export interface LoadModeView {
    setLoadMode(mode: LoadMode): void;
}
export declare function isLoadModeView(value: any): value is LoadModeView;
export declare function setChildLoadMode(el: HTMLElement, mode: LoadMode): void;
