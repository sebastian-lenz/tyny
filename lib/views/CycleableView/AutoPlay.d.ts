import { Behaviour } from '../../core/Behaviour';
import { CycleableView } from './index';
export interface AutoPlayOptions {
    autoStart?: boolean;
    interval?: number;
}
export declare class AutoPlay extends Behaviour<CycleableView> {
    id: number;
    interval: number;
    isStarted: boolean;
    protected _timeout: number | null;
    constructor(view: CycleableView, options?: AutoPlayOptions);
    pause(): void;
    start(): void;
    protected onDestroyed(): void;
    protected onTimeout: () => void;
    protected onTransist: () => void;
}
