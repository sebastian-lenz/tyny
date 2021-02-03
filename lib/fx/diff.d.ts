/**
 * Describes the result of the [[diff]] function.
 */
export interface DiffResult {
    /**
     * A list of all elements that have been created.
     */
    created: DiffState[];
    /**
     * A list of all elements that have been deleted.
     */
    deleted: DiffState[];
    /**
     * A list of all elements that have changed.
     */
    changed: DiffChangedState[];
}
/**
 * Describes the state of a created or deleted element returned by [[diff]].
 */
export interface DiffState {
    /**
     * The related element.
     */
    element: HTMLElement;
    /**
     * The position of the element.
     */
    position: ClientRect;
    /**
     * Is the element within the visible viewport?
     */
    inViewport: boolean;
}
/**
 * Describes the state of a changed element returned by [[diff]].
 */
export interface DiffChangedState {
    /**
     * The related element.
     */
    element: HTMLElement;
    /**
     * The original position of the element.
     */
    from: ClientRect;
    /**
     * The new position of the element.
     */
    to: ClientRect;
    /**
     * Is or was the element within the visible viewport?
     */
    inViewport: boolean;
}
export interface DiffCallback {
    (): HTMLElement[];
}
/**
 * Calculate the difference between two lists of elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 */
export declare function diff(initialElements: HTMLElement[], callback: DiffCallback): DiffResult;
