import type { Params } from '../../core/Params';
import type { View } from '../../core';
export declare enum CropMode {
    Cover = 0,
    Fit = 1,
    FitColumn = 2,
    Stretch = 3,
    Width = 4,
    Height = 5
}
export interface CropOptions {
    disableMaskResize?: boolean;
    focusY?: number;
    focusX?: number;
    maxScale?: number;
    minScale?: number;
    mode?: CropMode;
}
export interface CropResult {
    left: number;
    top: number;
    width: number;
    height: number;
    forcedHeight: number | undefined;
    forcedWidth: number | undefined;
}
export declare class Crop {
    disableMaskResize: boolean;
    focusX: number;
    focusY: number;
    height: number;
    maxScale: number;
    minScale: number;
    mode: CropMode;
    width: number;
    constructor(options?: CropOptions);
    apply(mask: HTMLElement, image: HTMLElement, maskWidth?: number, maskHeight?: number): CropResult;
    clone(options?: CropOptions): Crop;
    getImageDimensions(maskWidth: number, maskHeight: number): tyny.Dimensions;
    getCrop(maskWidth: number, maskHeight: number): CropResult;
    toOptions(): CropOptions;
    static create(view: View, { crop }: {
        crop?: Crop | CropOptions;
    }): Crop;
    static fromParams(params: Params): Crop;
}
