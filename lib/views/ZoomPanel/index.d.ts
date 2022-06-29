import { View, ViewOptions } from '../../core';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';
export interface ZoomPanelOptions extends ViewOptions {
}
export declare type ResizeMode = 'fit' | 'clamp' | 'none';
export declare abstract class ZoomPanel extends View {
    fitPadding: number;
    height: number;
    position: tyny.Point;
    resizeMode: ResizeMode;
    scale: number;
    width: number;
    readonly wheelBehaviour: WheelBehaviour;
    readonly zoomBehaviour: ZoomBehaviour;
    constructor(options: ZoomPanelOptions);
    abstract draw(): void;
    abstract getNativeHeight(): number;
    abstract getNativeWidth(): number;
    clampView(): void;
    fitToView(): void;
    getPositionBounds(scale?: number): tyny.BoundingBox;
    getScaleBounds(): tyny.Interval;
    limitPosition({ x, y }: tyny.Point, scale?: number): tyny.Point;
    limitScale(scale: number): number;
    setPosition({ x, y }: tyny.Point): void;
    setScale(value: number): void;
    protected onMeasure(): (() => void) | undefined;
}
