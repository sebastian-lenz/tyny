import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
import { FilterableViewParams } from '../index';
export interface SelectModifierOptions extends ViewModifierOptions {
    defaultValue?: string;
    paramName?: string;
    triggerSoftReset?: boolean;
}
export declare class SelectModifier extends ViewModifier {
    el: HTMLSelectElement;
    value: string;
    defaultValue: string | null;
    triggerSoftReset: boolean;
    get paramName(): string;
    constructor(options?: SelectModifierOptions);
    getValue(): string | null;
    getParams(): FilterableViewParams;
    setValue(value: string | null, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
