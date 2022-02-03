import { JSX, RefObject } from 'preact';
export declare type TransitionElement = HTMLElement;
export interface Transition {
    begin: (callback: Function) => void;
    childRef: RefObject<TransitionElement> | null;
    lastChildRef: RefObject<TransitionElement> | null;
}
export interface TransitionEffect {
    (from: TransitionElement | null, to: TransitionElement | null, options: TransitionOptions): Promise<any>;
}
export interface TransitionOptions {
    child: JSX.Element | null;
    childRef: RefObject<HTMLElement> | null;
    lastChild: JSX.Element | null;
    lastChildRef: RefObject<HTMLElement> | null;
    effect: TransitionEffect;
    rootRef: RefObject<HTMLElement>;
}
export declare function createTransition(options: TransitionOptions): Transition;
