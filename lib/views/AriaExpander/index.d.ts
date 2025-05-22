import { View } from '../../core';
import type { ViewOptions } from '../../core';
export interface AriaExpanderOptions extends ViewOptions {
    mask?: HTMLElement | string;
}
export declare class AriaExpander extends View {
    button: HTMLElement | null;
    isExpanded: boolean;
    mask: HTMLElement | null;
    target: HTMLElement | null;
    constructor(options: AriaExpanderOptions);
    onButtonClick(event: tyny.DelegateEvent): void;
    setExpanded(value?: boolean): void;
}
