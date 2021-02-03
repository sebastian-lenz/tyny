export interface FetchOptions {
    body?: Document | BodyInit | null;
    credentials?: string;
    headers?: tyny.Map<string>;
    method?: string;
}
export interface FetchResponse {
    ok: boolean;
    statusText: string;
    status: number;
    url: string;
    text: () => Promise<string>;
    json: () => Promise<any>;
    blob: () => Promise<Blob>;
    clone: () => FetchResponse;
    headers: {
        keys(): string[];
        entries(): [string, string][];
        get(n: string): string | undefined;
        has(n: string): boolean;
    };
}
export declare function fetch(url: string, options?: FetchOptions): Promise<FetchResponse>;
