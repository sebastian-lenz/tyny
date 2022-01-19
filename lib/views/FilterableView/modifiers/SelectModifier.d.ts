import { SyncOptions } from '../Modifier';
import { UrlParamValue } from '../../../utils/types/Url';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
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
    getParams(): tyny.Map<UrlParamValue>;
    setValue(value: string | null, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
