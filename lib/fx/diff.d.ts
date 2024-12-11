export interface DiffResult {
    changed: DiffChangedState[];
    created: DiffState[];
    deleted: DiffState[];
}
export interface DiffState {
    element: HTMLElement;
    inViewport: boolean;
    position: DOMRect;
}
export interface DiffChangedState {
    element: HTMLElement;
    from: DOMRect;
    inViewport: boolean;
    to: DOMRect;
}
export type DiffInitialState = Array<{
    element: HTMLElement;
    position: DOMRect;
}>;
export type DiffCallback = () => Array<HTMLElement>;
export declare function createDiffState(elements: Array<HTMLElement>): DiffInitialState;
export declare function diff(elements: Array<HTMLElement>, callback: DiffCallback): DiffResult;
export declare function diffFromState(state: DiffInitialState, elements: Array<HTMLElement>): DiffResult;
