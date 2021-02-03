import { Transition } from './index';
export interface DissolveOptions {
    duration?: number;
    delay?: number;
    noCrossFade?: boolean;
    noPureFadeIn?: boolean;
    noPureFadeOut?: boolean;
    timingFunction?: string;
}
export declare function dissolve(options?: DissolveOptions): Transition;
