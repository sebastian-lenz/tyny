export interface ZoomOptions {
    fromOpacity: number;
    fromScale: number;
    toOpacity: number;
    toScale: number;
}
export declare function fadeZoom({ fromOpacity, fromScale, toOpacity, toScale, }: ZoomOptions): string;
