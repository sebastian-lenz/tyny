import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
import { FilterableViewParams } from '..';
export interface InputModifierOptions extends ViewModifierOptions {
    defaultValue?: string;
    paramName?: string;
    triggerSoftReset?: boolean;
}
export declare class InputModifier extends ViewModifier {
    el: HTMLInputElement;
    onChangeDebounced: Function | null;
    value: string;
    changeDelay: number;
    defaultValue: string;
    triggerSoftReset: boolean;
    get paramName(): string;
    constructor(options?: InputModifierOptions);
    getValue(): string;
    getParams(): FilterableViewParams;
    setValue(value: string, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
