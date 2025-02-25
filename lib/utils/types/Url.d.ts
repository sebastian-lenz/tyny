export type Param = ParamValue | SafeParam;
export type ParamValue = string | number | boolean;
export interface SafeParam {
    __param: ParamValue;
}
export interface UrlParts {
    fragment?: string;
    path: string;
    query: tyny.Map<Param | null | undefined>;
}
export declare class Url {
    fragment: string;
    path: string;
    query: tyny.Map<Param>;
    constructor(url: string);
    clearParam(name: string): this;
    clearParams(): this;
    getParam(name: string, defaultValue: ParamValue): ParamValue;
    getParam(name: string, defaultValue?: ParamValue | null): ParamValue | null;
    getIntParam(name: string, defaultValue: number): number;
    getIntParam(name: string, defaultValue?: null): number | null;
    getStringParam(name: string, defaultValue: string): string;
    getStringParam(name: string, defaultValue?: null): string | null;
    parse(url: string): this;
    setParam(name: string, value?: Param | null | undefined): this;
    setParams(params: tyny.Map<Param | null | undefined>): this;
    toString(): string;
    static compose({ fragment, path, query }: UrlParts): string;
    static create(value: string): Url;
    static safeParam(value: ParamValue): SafeParam;
}
