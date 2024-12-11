import { CreateElementOptions } from '../utils/dom/node/createElement';
import type { View, ViewOptions } from './View';
export interface Param<TValue = any> {
    attribute?: string;
    defaultValue?: TValue | {
        (): TValue;
    };
    property?: string;
    name: string;
}
export type SafeParam<TParam extends Param<TValue> = Param<any>, TValue = any> = TParam & {
    defaultValue: TValue | {
        (): TValue;
    };
};
export interface EnumParam<TValue = any> extends Param<TValue[keyof TValue]> {
    enum: TValue;
}
export interface InstanceParam<TValue = any> extends Param<TValue> {
    ctor: {
        new (data: any): TValue;
    };
}
export interface ParamsReader {
    getValue(name: string, options: Param): any;
    hasValue(name: string, options: Param): boolean;
}
export declare class ParamsAttributeReader implements ParamsReader {
    element: HTMLElement;
    constructor(element: HTMLElement);
    getValue(name: string, options: Param): any;
    hasValue(name: string, options: Param): boolean;
}
export declare class ParamsObjectReader implements ParamsReader {
    readonly object: any;
    constructor(object: any);
    getValue(name: string, options: Param): any;
    hasValue(name: string, options: Param): boolean;
}
export declare class Params {
    readonly options: any;
    readonly readers: Array<ParamsReader>;
    readonly view: View;
    constructor(view: View, options: ViewOptions);
    read<T>(options: Param<T>): T | null;
    bool(options: Param<boolean>): boolean;
    element<T extends HTMLElement>(options: Param<string | T> & {
        defaultValue: T | {
            (): T;
        };
    }): T;
    element<T extends HTMLElement>(options: Param<string | T> & CreateElementOptions & {
        tagName: string;
    }): T;
    element<T extends HTMLElement>(options: Param<string | T> & CreateElementOptions): T | null;
    enum<T extends Object>(options: SafeParam<EnumParam<T>>): T[keyof T];
    enum<T extends Object>(options: EnumParam<T>): T[keyof T] | null;
    instance<T>(options: InstanceParam<T>): T;
    int(options: SafeParam<Param<number>>): number;
    int(options: Param<number>): number | null;
    number(options: SafeParam<Param<number>>): number;
    number(options: Param<number>): number | null;
    string(options: SafeParam<Param<string>>): string;
    string(options: Param<string>): string | null;
}
