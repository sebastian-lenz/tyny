import { SyncOptions } from '../Modifier';
import { ViewModifier, ViewModifierOptions } from '../ViewModifier';
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
    getParams(): tyny.Map<string | null>;
    setValue(value: string, silent?: boolean): void;
    sync({ url }: SyncOptions): boolean;
    onChange(): void;
}
