export declare class IntersectionObserverClass implements IntersectionObserver {
    readonly root: Element | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number>;
    private apply;
    private off;
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
export interface VisibilityTarget {
    el: Element;
    setVisible(value: boolean): void;
}
export declare class VisibilityObserver {
    private observer;
    private targets;
    constructor();
    hasTargets(el: Element): boolean;
    observe(target: VisibilityTarget): void;
    unobserve(target: VisibilityTarget): void;
}
export declare const visibility: VisibilityObserver;
