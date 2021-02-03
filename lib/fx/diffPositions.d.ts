import { DiffCallback, DiffResult } from './diff';
/**
 * Available options for [[diffPositions]].
 */
export interface DiffPositionsOptions {
    /**
     * Should changes along the x axis be ignored?
     */
    ignoreX?: boolean;
    /**
     * Should changes along the y axis be ignored?
     */
    ignoreY?: boolean;
    /**
     * Should a 3d transform be used to animated the elements?
     */
    useTransform3D?: boolean;
    finished?: Function;
}
/**
 * Animate the changed positions of the given elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 * @param options   The advanced options used to animate the elements.
 */
export declare function diffPositions(initialElements: HTMLElement[], callback: DiffCallback, options?: DiffPositionsOptions): DiffResult;
