import { RefObject } from 'preact';
export declare type TransitionElement = HTMLElement;
export interface Transition {
    begin: (callback: Function) => void;
    childRef: RefObject<TransitionElement> | null;
    lastChildRef: RefObject<TransitionElement> | null;
}
export interface TransitionEffect {
    (from: TransitionElement | null, to: TransitionElement | null): Promise<any>;
}
export interface TransitionOptions {
    childRef: RefObject<HTMLElement> | null;
    lastChildRef: RefObject<HTMLElement> | null;
    effect: TransitionEffect;
}
export default function createTransition({ childRef, effect, lastChildRef, }: TransitionOptions): Transition;
