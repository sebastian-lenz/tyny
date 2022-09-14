export declare class IntersectionObserverClass implements IntersectionObserver {
    readonly root: Element | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number>;
    private apply;
    private off?;
    private offsetTop;
    private offsetLeft;
    private targets;
    constructor(callback: IntersectionObserverCallback, { rootMargin }?: IntersectionObserverInit);
    disconnect(): void;
    observe(target: HTMLElement): void;
    takeRecords(): IntersectionObserverEntry[];
    unobserve(element: HTMLElement): void;
}
export declare const IntersectionObserver: {
    new (callback: IntersectionObserverCallback, options?: IntersectionObserverInit | undefined): IntersectionObserver;
    prototype: IntersectionObserver;
};
export interface VisibilityCallback {
    (value: boolean): void;
    isIntersecting?: boolean;
}
export interface VisibilityTarget {
    el: Element;
    setVisible: VisibilityCallback;
}
export declare class VisibilityObserver {
    isPrinting: boolean;
    observer: IntersectionObserver;
    targets: VisibilityTarget[];
    constructor();
    hasTargets(el: Element): boolean;
    observe(target: VisibilityTarget): void;
    onAfterPrint(): void;
    onBeforePrint(): void;
    unobserve(target: VisibilityTarget): void;
    updateTargets(): void;
}
export declare const visibility: VisibilityObserver;
