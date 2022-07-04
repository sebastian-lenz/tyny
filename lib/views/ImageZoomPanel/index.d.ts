import { Image } from '../Image';
import { ZoomPanel, ZoomPanelOptions } from '../ZoomPanel';
export interface ImageZoomPanelOptions extends ZoomPanelOptions {
    border?: number;
    image?: string;
}
export declare class ImageZoomPanel extends ZoomPanel {
    border: number;
    readonly image: Image | null;
    constructor(options: ImageZoomPanelOptions);
    draw(): void;
    getNativeHeight(): number;
    getNativeWidth(): number;
}
