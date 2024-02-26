import { DiffCallback, DiffResult } from './diff';
import { TransistOptions } from './transist';
export interface Options {
    ignoreX?: boolean;
    ignoreY?: boolean;
    positionTransition?: TransistOptions;
    useTransform3D?: boolean;
}
export declare function transistPositions({ changed }: DiffResult, { ignoreX, ignoreY, positionTransition, useTransform3D }?: Options): Promise<void>;
export declare function diffPositions(initialElements: HTMLElement[], callback: DiffCallback, options?: Options & {
    finished?: VoidFunction;
}): DiffResult;
