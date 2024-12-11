export type AttrMap = {
    [name: string]: AttrValue;
};
export type AttrValue = AttrPrimitive | AttrCallback;
export type AttrPrimitive = string | number | null;
export type AttrCallback = {
    (value: string | null, element: Element): AttrPrimitive;
};
export declare function attr(target: tyny.ElementLike, name: AttrMap): void;
export declare function attr(target: tyny.ElementLike, name: string): string | null;
export declare function attr(target: tyny.ElementLike, name: string, value: AttrValue): void;
