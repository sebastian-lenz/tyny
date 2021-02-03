import { Transition } from './index';
export interface RollOptions {
    duration?: number;
    delay?: number;
    fade?: boolean;
    timingFunction?: string;
    x?: number;
    y?: number;
}
export declare function roll({ fade, x, y, ...options }?: RollOptions): Transition;
