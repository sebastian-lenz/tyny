import { View, ViewOptions } from '../../core';
import { Label } from './template';
export interface DropDownOptions extends ViewOptions {
    flyout?: HTMLElement | string;
    label?: HTMLElement | string;
    groupLabel?: Label<HTMLOptGroupElement>;
    optionLabel?: Label<HTMLOptionElement>;
    selectedLabel?: Label<HTMLOptionElement[]>;
}
export declare class DropDown extends View {
    groupLabel: Label<HTMLOptGroupElement>;
    optionLabel: Label<HTMLOptionElement>;
    selectedLabel: Label<HTMLOptionElement[]>;
    flyout: HTMLElement;
    label: HTMLElement;
    select: HTMLSelectElement | null;
    constructor({ groupLabel, optionLabel, selectedLabel, ...options }?: DropDownOptions);
    onConnected(): void;
    protected onElementChanged(): void;
    protected onOptionClick(event: tyny.DelegateEvent): void;
    onUpdate(): () => void;
    protected onValueChanged(): void;
    protected renderFlyout(): void;
    protected renderLabel(): void;
    protected toggleValue(value: string): void;
}
