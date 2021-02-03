import { Crop, CropOptions, CropResult } from './Crop';
import { View, ViewOptions } from '../../core';
export interface ImageCropOptions extends ViewOptions, Partial<CropOptions> {
    crop?: Crop | CropOptions;
    target?: HTMLElement | string;
}
export declare class ImageCrop extends View {
    currentCrop: CropResult | null;
    crop: Crop;
    displayHeight: number;
    displayWidth: number;
    target: HTMLElement | null;
    constructor(options?: ImageCropOptions);
    forceDraw(): void;
    getDisplaySize(): {
        height: number;
        width: number;
    };
    protected onMeasure(): (() => void) | undefined;
    protected onSizeChanged(): void;
}
