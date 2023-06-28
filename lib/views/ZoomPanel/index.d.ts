import { View, ViewOptions } from '../../core';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';
export interface ZoomPanelOptions extends ViewOptions {
    enabled?: boolean;
}
export declare type ResizeMode = 'auto' | 'cover' | 'fit' | 'clamp' | 'none';
export declare type ViewProps = [number, number, number];
export declare abstract class ZoomPanel extends View {
    coverPadding: number;
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
    applyViewProps([x, y, scale]: ViewProps): void;
    clampView(): void;
    coverView(): void;
    isCoverView(): boolean;
    isFitToView(): boolean;
    fitToView(): void;
    matchesViewProps([x, y, scale]: ViewProps): boolean;
    getCenteredViewProps(scale: number): ViewProps;
    getCoverViewProps(padding?: number): ViewProps;
    getFitToViewProps(padding?: number): ViewProps;
    getPositionBounds(scale?: number): tyny.BoundingBox;
    getScaleBounds(): tyny.Interval;
    limitPosition({ x, y }: tyny.Point, scale?: number): tyny.Point;
    limitScale(scale: number): number;
    setPosition({ x, y }: tyny.Point): void;
    setScale(value: number): void;
    onMeasure(): (() => void) | undefined;
}
