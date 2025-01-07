export type HasAttribute<Key extends string, Type> = {
    [K in Key]: Type;
};
export declare const hasArray: {
    <Key extends string>(obj: Object, key: Key, optional?: boolean, validate?: ((value: any[]) => boolean) | undefined): obj is HasAttribute<Key, any[]>;
    <Key_1 extends string>(obj: Object, key: Key_1, optional: true, validate?: ((value: any[]) => boolean) | undefined): obj is HasAttribute<Key_1, any[] | undefined>;
};
export declare const hasBoolean: {
    <Key extends string>(obj: Object, key: Key, optional?: boolean, validate?: ((value: boolean) => boolean) | undefined): obj is HasAttribute<Key, boolean>;
    <Key_1 extends string>(obj: Object, key: Key_1, optional: true, validate?: ((value: boolean) => boolean) | undefined): obj is HasAttribute<Key_1, boolean | undefined>;
};
export declare const hasNumber: {
    <Key extends string>(obj: Object, key: Key, optional?: boolean, validate?: ((value: number) => boolean) | undefined): obj is HasAttribute<Key, number>;
    <Key_1 extends string>(obj: Object, key: Key_1, optional: true, validate?: ((value: number) => boolean) | undefined): obj is HasAttribute<Key_1, number | undefined>;
};
export declare const hasObject: {
    <Key extends string>(obj: Object, key: Key, optional?: boolean, validate?: ((value: object) => boolean) | undefined): obj is HasAttribute<Key, object>;
    <Key_1 extends string>(obj: Object, key: Key_1, optional: true, validate?: ((value: object) => boolean) | undefined): obj is HasAttribute<Key_1, object | undefined>;
};
export declare const hasString: {
    <Key extends string>(obj: Object, key: Key, optional?: boolean, validate?: ((value: string) => boolean) | undefined): obj is HasAttribute<Key, string>;
    <Key_1 extends string>(obj: Object, key: Key_1, optional: true, validate?: ((value: string) => boolean) | undefined): obj is HasAttribute<Key_1, string | undefined>;
};
export declare class Shape {
    value: Object;
    $result: boolean;
    constructor(value: Object);
    get isValid(): boolean;
    array(key: string, optional?: boolean, validate?: (value: Array<any>) => boolean): Shape;
    boolean(key: string, optional?: boolean, validate?: (value: boolean) => boolean): Shape;
    enum<T>(key: string, values: Array<T>, optional?: boolean, validate?: (value: T) => boolean): this;
    number(key: string, optional?: boolean, validate?: (value: number) => boolean): Shape;
    object(key: string, optional?: boolean, validate?: (value: object) => boolean): Shape;
    shape(key: string, validate: (value: Shape) => Shape, optional?: boolean): Shape;
    shapes(key: string, validate: (value: Shape) => Shape, optional?: boolean): Shape;
    string(key: string, optional?: boolean, validate?: (value: string) => boolean): Shape;
    static for(value: any): Shape;
}
