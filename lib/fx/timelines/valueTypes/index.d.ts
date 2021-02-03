export declare type ValueTypeSource = string | number | object;
export declare type ValueType<T = any> = {
    add(a: T, b: T): T;
    clone(value: T): T;
    fromArray(values: number[]): T;
    length(value: T): number;
    origin(): T;
    scale(value: T, scale: number): T;
    subtract(a: T, b: T): T;
    toArray(value: T): number[];
};
export declare type MaybeValueType<T = any> = ValueType<T> | undefined;
export declare type ValueTypeFactory<T = any> = (value: T) => MaybeValueType<T>;
export declare const valueTypeFactories: ValueTypeFactory[];
export declare function createValueType<T>(value: T): MaybeValueType<T>;
