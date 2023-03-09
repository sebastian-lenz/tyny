export declare const scrollbarsChangeEvent = "tyny:scrollbarsChange";
export declare const scrollbarOptions: {
    classOptions: {
        className: string;
        target: HTMLElement;
    } | null;
    scrollbarProp: string | ((value: number) => void);
};
export interface ScrollbarsEventArgs {
    hasScrollbars: boolean;
    scrollBarSize: number;
}
export declare function getScrollBarSize(): number;
export declare function hasScrollbars(): boolean;
export declare function toggleScrollbars(origin: any, enabled: boolean): void;
