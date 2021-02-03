import { Effect } from './Effect';
export declare type Translation = 'translateX' | 'translateY';
export interface SlideEffectOptions {
    translation?: Translation;
    useOpacity?: boolean;
}
export declare class SlideEffect extends Effect {
    translation: Translation;
    useOpacity: boolean;
    constructor({ translation, useOpacity, }?: SlideEffectOptions);
    protected applyFrom(element: HTMLElement, value: number): void;
    protected applyTo(element: HTMLElement, value: number): void;
    protected clearElement(element: HTMLElement): void;
}
