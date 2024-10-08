import { View } from '../../core';
import type { ViewOptions } from '../../core';
export declare class AriaExpander extends View {
    button: HTMLElement | null;
    isExpanded: boolean;
    target: HTMLElement | null;
    constructor(options: ViewOptions);
    onButtonClick(event: tyny.DelegateEvent): void;
    setExpanded(value?: boolean): void;
}
