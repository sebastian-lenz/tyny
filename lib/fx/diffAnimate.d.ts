import { AnimateOptions } from './animate';
import { DiffCallback, DiffResult } from './diff';
import { Options as PositionOptions } from './diffPositions';
export interface Options extends PositionOptions {
    animateOptions?: AnimateOptions;
    fadeIn?: string;
    fadeOut?: string;
    detach?: boolean;
    origin?: HTMLElement;
}
export declare function transistChanges(diff: DiffResult, options?: Options): Promise<void>;
export declare function diffAnimate(initialElements: HTMLElement[], callback: DiffCallback, options?: Options & {
    finished?: VoidFunction;
}): DiffResult;
