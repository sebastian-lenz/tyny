import { TransitionEffect } from '../createTransition';
export interface DissolveOptions {
    fadeIn?: number;
    fadeInKeyFrames?: string;
    fadeOut?: number;
    fadeOutKeyFrames?: string;
}
export declare function dissolve({ fadeIn, fadeInKeyFrames, fadeOut, fadeOutKeyFrames, }?: DissolveOptions): TransitionEffect;
