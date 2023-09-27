export interface DiffResult {
    created: DiffState[];
    deleted: DiffState[];
    changed: DiffChangedState[];
}
export interface DiffState {
    element: HTMLElement;
    position: ClientRect;
    inViewport: boolean;
}
export interface DiffChangedState {
    element: HTMLElement;
    from: ClientRect;
    to: ClientRect;
    inViewport: boolean;
}
export interface DiffCallback {
    (): HTMLElement[];
}
export declare function diff(initialElements: HTMLElement[], callback: DiffCallback): DiffResult;
