import { TransitionEffect } from '../createTransition';
export interface DissolveOptions {
    fadeIn?: number;
    fadeOut?: number;
}
export default function dissolve({ fadeIn, fadeOut, }?: DissolveOptions): TransitionEffect;
