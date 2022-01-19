export declare type UrlParamValue = string | UrlParamSafeValue | null | undefined;
export interface UrlParamSafeValue {
    __param: string;
}
export interface UrlParts {
    fragment?: string;
    path: string;
    query: tyny.Map<UrlParamValue>;
}
export declare class Url {
    fragment: string;
    path: string;
    query: tyny.Map<string>;
    constructor(url: string);
    clearParam(name: string): this;
    clearParams(): this;
    getParam(name: string, defaultValue: string): string;
    getParam(name: string, defaultValue?: string | null): string | null;
    parse(url: string): this;
    setParam(name: string, value?: string | null): this;
    setParams(value: tyny.Map<string>): this;
    toString(): string;
    static compose({ fragment, path, query }: UrlParts): string;
    static create(value: string): Url;
    static safeParam(value: string): UrlParamSafeValue;
}
