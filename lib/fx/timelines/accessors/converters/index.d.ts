import { Accessor } from '../index';
export interface ConverterFactory {
    (accessor: Accessor): Accessor;
}
export declare const converterFactories: ConverterFactory[];
export declare function injectConverter(accessor: Accessor): Accessor;
