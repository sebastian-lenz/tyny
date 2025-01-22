export type HasAttribute<Key extends string, Type> = {
    [K in Key]: Type;
};
export interface HasOptions {
    nullable?: boolean;
    optional?: boolean;
}
type Validator<Type> = (value: Type) => boolean;
interface HasFunction<Type> {
    <Key extends string>(obj: Object, key: Key, options: {
        optional: true;
    }, validate?: Validator<Type>): obj is HasAttribute<Key, Type | undefined>;
    <Key extends string>(obj: Object, key: Key, options: {
        nullable: true;
    }, validate?: Validator<Type>): obj is HasAttribute<Key, Type | null>;
    <Key extends string>(obj: Object, key: Key, options: {
        nullable: true;
        optional: true;
    }, validate?: Validator<Type>): obj is HasAttribute<Key, Type | undefined | null>;
    <Key extends string>(obj: Object, key: Key, options?: HasOptions, validate?: Validator<Type>): obj is HasAttribute<Key, Type>;
}
export type Type = 'array' | 'bigint' | 'boolean' | 'function' | 'number' | 'null' | 'object' | 'string' | 'symbol' | 'undefined';
export declare function typeOf(value: any): Type;
export declare const hasArray: HasFunction<any[]>;
export declare const hasBoolean: HasFunction<boolean>;
export declare const hasNumber: HasFunction<number>;
export declare const hasObject: HasFunction<object>;
export declare const hasString: HasFunction<string>;
export declare class Shape {
    value: Object;
    $result: boolean;
    constructor(value: Object);
    get isValid(): boolean;
    array(key: string, options?: HasOptions, validate?: (value: Array<any>) => boolean): Shape;
    boolean(key: string, options?: HasOptions, validate?: (value: boolean) => boolean): Shape;
    enum<T>(key: string, values: Array<T>, { optional, nullable }?: HasOptions, validate?: (value: T) => boolean): this;
    number(key: string, options?: HasOptions, validate?: (value: number) => boolean): Shape;
    object(key: string, options?: HasOptions, validate?: (value: object) => boolean): Shape;
    shape(key: string, validate: (value: Shape) => Shape, options?: HasOptions): Shape;
    shapes(key: string, validate: (value: Shape) => Shape, options?: HasOptions): Shape;
    string(key: string, options?: HasOptions, validate?: (value: string) => boolean): Shape;
    static for(value: any): Shape;
}
export {};
