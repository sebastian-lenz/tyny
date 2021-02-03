export interface GoogleMapsOptions {
    apiKey?: string;
    query?: tyny.Map<string> | null;
    endpoint?: string;
}
export declare function requireGoogleMaps({ apiKey, query, endpoint, }?: GoogleMapsOptions): Promise<void>;
export declare namespace requireGoogleMaps {
    const apiKey: string;
}
