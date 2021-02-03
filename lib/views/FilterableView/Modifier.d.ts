import type { FilterableViewParams } from './index';
import type { Url } from '../../utils/types/Url';
export interface SyncOptions {
    silent: boolean;
    url: Url;
}
export interface Modifier {
    getParams(): FilterableViewParams;
    softReset(): void;
    sync(options: SyncOptions): boolean;
}
