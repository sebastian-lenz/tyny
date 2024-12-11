import { MaybeValueType } from './index';
export type Vector = {
    [field: string]: number;
};
export declare const knownVectors: string[][];
export declare function vectorValueType(initialValue: any): MaybeValueType;
