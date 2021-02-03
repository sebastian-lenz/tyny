export interface UrlParts {
    fragment?: string;
    path: string;
    query: tyny.Map<string | null | undefined>;
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
}
