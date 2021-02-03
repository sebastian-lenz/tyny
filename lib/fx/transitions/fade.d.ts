import { Transition } from './index';
export interface FadeOptions {
    duration?: number;
    delay?: number;
    timingFunction?: string;
}
export declare function fade(options?: FadeOptions): Transition;
