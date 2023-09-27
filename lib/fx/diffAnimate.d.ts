import { DiffPositionsOptions } from './diffPositions';
import { DiffCallback, DiffResult } from './diff';
export interface DiffAnimateOptions extends DiffPositionsOptions {
    detach?: boolean;
    origin?: HTMLElement;
}
export declare function diffAnimate(initialElements: HTMLElement[], callback: DiffCallback, options?: DiffAnimateOptions): DiffResult;
