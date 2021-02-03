import { DiffPositionsOptions } from './diffPositions';
import { DiffCallback, DiffResult } from './diff';
/**
 * Available options for [[diffAnimate]].
 */
export interface DiffAnimateOptions extends DiffPositionsOptions {
    /**
     * Should deleted elements be detached?
     */
    detach?: boolean;
    origin?: HTMLElement;
}
/**
 * Animate the changed positions of the given elements, fade in new elements and fade out deleted elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 * @param options   The advanced options used to animate the elements.
 */
export declare function diffAnimate(initialElements: HTMLElement[], callback: DiffCallback, options?: DiffAnimateOptions): DiffResult;
