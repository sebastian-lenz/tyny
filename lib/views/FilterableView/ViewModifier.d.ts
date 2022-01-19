import { FilterableView } from './index';
import { View, ViewOptions } from '../../core';
import { UrlParamValue } from '../../utils/types/Url';
import type { Modifier, SyncOptions } from './Modifier';
export interface ViewModifierOptions extends ViewOptions {
}
export declare abstract class ViewModifier extends View implements Modifier {
    constructor(options?: ViewModifierOptions);
    get target(): FilterableView | null;
    softReset(): void;
    abstract getParams(): tyny.Map<UrlParamValue>;
    abstract sync(options: SyncOptions): boolean;
}
