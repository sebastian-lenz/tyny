import type { TransitionEffect } from '../createTransition';
export interface CreateEffectOptions {
    fadeIn?: number;
    fadeInDelay?: number;
    fadeInKeyFrames?: string;
    fadeOut?: number;
    fadeOutKeyFrames?: string;
}
export declare function createEffect({ fadeIn, fadeInDelay, fadeInKeyFrames, fadeOut, fadeOutKeyFrames, }?: CreateEffectOptions): TransitionEffect;
