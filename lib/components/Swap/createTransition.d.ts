import { JSX, RefObject, VNode } from 'preact';
export type TransitionElement = HTMLElement | VNode;
export interface Transition {
    begin: (callback: Function) => void;
    childRef: RefObject<TransitionElement> | null;
    lastChildRef: RefObject<TransitionElement> | null;
}
export interface TransitionEffect {
    (from: HTMLElement | null, to: HTMLElement | null, options: TransitionOptions): Promise<any>;
}
export interface TransitionOptions {
    child: JSX.Element | null;
    childRef: RefObject<HTMLElement> | null;
    lastChild: JSX.Element | null;
    lastChildRef: RefObject<HTMLElement> | null;
    effect: TransitionEffect;
    rootRef: RefObject<HTMLElement>;
}
export declare function toElement(value: TransitionElement | null): HTMLElement | null;
export declare function createTransition(options: TransitionOptions): Transition;
