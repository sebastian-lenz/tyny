import { SyncOptions } from '../Modifier';
import { UrlParamValue } from '../../../utils/types/Url';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
export interface CheckboxModifierOptions extends ViewModifierOptions {
    defaultValue?: boolean;
    paramName?: string;
    triggerSoftReset?: boolean;
}
export declare class CheckboxModifier extends ViewModifier {
    el: HTMLInputElement;
    value: string;
    defaultValue: boolean;
    triggerSoftReset: boolean;
    get paramName(): string;
    constructor(options?: CheckboxModifierOptions);
    getValue(): boolean;
    getParams(): tyny.Map<UrlParamValue>;
    getParamValue(): string;
    setValue(value: boolean, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
