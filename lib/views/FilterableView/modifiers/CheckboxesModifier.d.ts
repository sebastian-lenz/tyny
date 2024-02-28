import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
import { FilterableViewParams } from '..';
export interface CheckboxesModifierOptions extends ViewModifierOptions {
    checkboxSelector?: string;
    glue?: string;
    paramName?: string;
    triggerSoftReset?: boolean;
}
export declare class CheckboxesModifier extends ViewModifier {
    checkboxSelector: string;
    glue: string;
    paramName: string;
    triggerSoftReset: boolean;
    constructor(options?: CheckboxesModifierOptions);
    getCheckboxes(): HTMLInputElement[];
    getParams(): FilterableViewParams;
    getValues(): Array<string>;
    setValues(values: Array<string>, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
