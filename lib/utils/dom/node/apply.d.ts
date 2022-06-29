export interface ApplyCallback {
    (element: HTMLElement): void;
}
export interface LateApplyCallback {
    (element: HTMLElement): void;
}
export declare function apply(element: HTMLElement | null | undefined, preCallback: ApplyCallback, postCallback?: ApplyCallback): void;
