import { TransitionEffect } from '../createTransition';
export interface CreateTransitionOptions {
    fadeIn?: number;
    fadeInDelay?: number;
    fadeInKeyFrames?: string;
    fadeOut?: number;
    fadeOutKeyFrames?: string;
}
export declare function createTransition({ fadeIn, fadeInDelay, fadeInKeyFrames, fadeOut, fadeOutKeyFrames, }?: CreateTransitionOptions): TransitionEffect;
export declare const dissolve: typeof createTransition;
