export declare type AttrMap = {
    [name: string]: AttrValue;
};
export declare type AttrValue = AttrPrimitive | AttrCallback;
export declare type AttrPrimitive = string | number | null;
export declare type AttrCallback = {
    (value: string | null, element: Element): AttrPrimitive;
};
export declare function attr(target: tyny.ElementLike, name: AttrMap): void;
export declare function attr(target: tyny.ElementLike, name: string): string | null;
export declare function attr(target: tyny.ElementLike, name: string, value: AttrValue): void;
