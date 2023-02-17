import { Crop, CropOptions } from '../ImageCrop/Crop';
import { LoadMode, LoadModeView } from '../../utils/views/loadMode';
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
export declare class Picture extends View implements LoadModeView, VisibilityTarget {
    currentImage: PictureImage | null;
    displayHeight: number;
    displayWidth: number;
    images: tyny.Map<PictureImage>;
    isVisible: boolean;
    loadMode: LoadMode;
    nextImage: PictureImage | null;
    sources: Source[];
    progress: number;
    protected canvas: HTMLCanvasElement | null;
    constructor(options?: PictureOptions);
    load(): Promise<void>;
    setLoadMode(value: LoadMode): void;
    setVisible(value: boolean): void;
    protected allowLoad(): boolean;
    protected findSource(width?: number, height?: number): Source | null;
    protected getImage(source: Source, url: string): PictureImage;
    onConnected(): void;
    onDisconnected(): void;
    protected onMeasure(): (() => void) | undefined;
    protected onSizeChanged(): void;
    protected onTransitionEnd(): void;
    protected render(): void;
    protected setProgress(value: number): void;
    protected tryTransist(): void;
    protected updateImage(): Promise<void> | null;
}
