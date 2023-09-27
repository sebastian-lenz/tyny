import { DiffCallback, DiffResult } from './diff';
export interface DiffPositionsOptions {
    ignoreX?: boolean;
    ignoreY?: boolean;
    useTransform3D?: boolean;
    finished?: Function;
}
export declare function diffPositions(initialElements: HTMLElement[], callback: DiffCallback, options?: DiffPositionsOptions): DiffResult;
