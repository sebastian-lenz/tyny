export interface TypeMap {
    string: string;
    number: number;
    bigint: bigint;
    boolean: boolean;
    symbol: Symbol;
    undefined: undefined;
    object: Object;
    function: Function;
}
export type TypeName = keyof TypeMap;
export declare function get<T>(obj: any, key: string | number | symbol): any;
export declare function get<T>(obj: any, key: string | number | symbol, fallback: T): T;
export declare function get<T extends TypeName>(obj: any, key: string | number | symbol, fallback: TypeMap[T], type: T): TypeMap[T];
export declare function get<T extends TypeName>(obj: any, key: string | number | symbol, fallback: null, type: T): TypeMap[T] | null;
