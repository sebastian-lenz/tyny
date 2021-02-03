export interface Accessor<T = any> {
    readonly property: string;
    readonly target: any;
    convert(value: any): T;
    getValue(): T;
    setValue(value: T): void;
}
export interface AccessorFactory {
    (target: any, property: string): MaybeAccessor;
}
export declare type MaybeAccessor = Accessor | undefined;
export declare const accessorFactories: AccessorFactory[];
export declare function createAccessor(target: any, property: string): MaybeAccessor;
