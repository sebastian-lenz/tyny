import { Crop, CropOptions } from '../ImageCrop/Crop';
import { View, ViewOptions } from '../../core';
import { Source } from './Source';
import { VisibilityTarget } from '../../services/visibility';
export interface PictureImage {
    image: HTMLImageElement;
    isLoaded: boolean;
    source: Source;
    url: string;
}
export interface PictureOptions extends ViewOptions, Partial<CropOptions> {
    crop?: Crop | CropOptions;
}
export declare class Picture extends View implements VisibilityTarget {
    protected currentImage: PictureImage | null;
    protected displayHeight: number;
    protected displayWidth: number;
    protected images: tyny.Map<PictureImage>;
    protected isVisible: boolean;
    protected nextImage: PictureImage | null;
    protected sources: Source[];
    protected progress: number;
    protected canvas: HTMLCanvasElement | null;
    constructor(options?: PictureOptions);
    setVisible(value: boolean): void;
    protected findSource(width?: number, height?: number): Source | null;
    protected getImage(source: Source, url: string): PictureImage;
    protected onConnected(): void;
    protected onDisconnected(): void;
    protected onMeasure(): (() => void) | undefined;
    protected onSizeChanged(): void;
    protected onTransitionEnd(): void;
    protected render(): void;
    protected setProgress(value: number): void;
    protected tryTransist(): void;
    protected updateImage(): void;
}
