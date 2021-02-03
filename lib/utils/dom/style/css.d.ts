export declare type CSSPropertyValue = number | string | null;
export declare function css(element: tyny.ElementLike, property: string): string | null;
export declare function css(element: tyny.ElementLike, property: string[]): tyny.Map<string | undefined> | undefined;
export declare function css(element: tyny.ElementLike, property: string, value: CSSPropertyValue): HTMLElement | undefined;
export declare function css(element: tyny.ElementLike, property: tyny.Map<CSSPropertyValue>): HTMLElement | undefined;
