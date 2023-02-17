import { Modifier } from './Modifier';
import { Swap, SwapOptions } from '../Swap';
import { UrlParamValue } from '../../utils/types/Url';
export declare type FilterableViewParam = UrlParamValue;
export declare type FilterableViewParams = tyny.Map<FilterableViewParam>;
export interface FilterableViewOptions extends SwapOptions {
}
export declare const filterChangedEvent = "tyny:filterChanged";
export declare class FilterableView<TParams extends FilterableViewParams = FilterableViewParams> extends Swap {
    skipSameUrl: boolean;
    staticParams: Partial<TParams>;
    protected _basePath: string;
    protected _fetchPath: string | undefined;
    protected _hasChanges: boolean;
    protected _request: Promise<any> | null;
    static responseCache: tyny.Map<string>;
    constructor(options: FilterableViewOptions);
    get modifiers(): Modifier[];
    commit({ disableLoad }?: {
        disableLoad?: boolean;
    }): void;
    getParams(overrides?: Partial<TParams>): TParams;
    getUrl(overrides?: Partial<TParams>, path?: string): string;
    softReset(): void;
    sync(silent?: boolean): void;
    protected createRequest(): Promise<string | null | false>;
    protected findContent(doc: Document): HTMLElement | null;
    protected load(): void;
    onConnected(): void;
    protected onPopState(): void;
}
