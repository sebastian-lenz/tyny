import { View, ViewOptions } from '../../core';
import { SourceSet } from './SourceSet';
import { VisibilityTarget } from '../../services/visibility';
export interface ImageOptions extends ViewOptions {
    sourceSet?: SourceSet | string;
}
export declare class Image extends View implements VisibilityTarget {
    readonly el: HTMLImageElement;
    currentSource: string;
    displayHeight: number;
    displayWidth: number;
    isLoaded: boolean;
    isVisible: boolean;
    naturalHeight: number;
    naturalWidth: number;
    get promise(): Promise<void>;
    sourceSet: SourceSet;
    constructor(options?: ImageOptions);
    load(): Promise<void>;
    setSource(value: string): void;
    setVisible(value: boolean): void;
    update(): void;
    protected onConnected(): void;
    protected onDisconnected(): void;
    protected onResize(): (() => void) | undefined;
}
