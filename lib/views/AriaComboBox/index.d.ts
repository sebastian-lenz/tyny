import { View } from '../../index';
import type { TransistHeightOptions } from '../../fx/transistHeight';
import type { ViewOptions } from '../../index';
export interface AriaComboBoxOptions extends ViewOptions {
    mask?: HTMLElement | string;
    transition?: TransistHeightOptions;
}
export declare class AriaComboBox extends View {
    activeOption: HTMLElement | null;
    isExpanded: boolean;
    selectedOption: HTMLElement | null;
    constructor(options: AriaComboBoxOptions);
    get activeIndex(): number;
    set activeIndex(value: number);
    get comboBox(): HTMLElement;
    get mask(): HTMLElement | null;
    get options(): Array<HTMLElement>;
    get selectedIndex(): number;
    set selectedIndex(value: number);
    handleChange(option: HTMLElement | null): void;
    onFocusOut(event: FocusEvent): void;
    onComboBoxClick(): void;
    onKeyDown(event: KeyboardEvent): void;
    onOptionClick(event: tyny.DelegateEvent): void;
    onOptionMouseOver(event: tyny.DelegateEvent): void;
    processKeyClosed(key: string): boolean;
    processKeyExpanded(key: string): boolean;
    setExpanded(value: boolean, initialActiveIndex?: number): void;
    setActiveOption(value: HTMLElement | null): void;
    setSelectedOption(value: HTMLElement | null): void;
}
