import { LoadMode, LoadModeView } from '../../utils/views/loadMode';
import { View, ViewOptions } from '../../core';
import { SourceSet } from './SourceSet';
import { VisibilityTarget } from '../../services/visibility';
export interface ImageOptions extends ViewOptions {
    sourceSet?: SourceSet | string;
}
export declare class Image extends View implements LoadModeView, VisibilityTarget {
    readonly el: HTMLImageElement;
    currentSource: string;
    displayHeight: number;
    displayWidth: number;
    isLoaded: boolean;
    isVisible: boolean;
    loadMode: LoadMode;
    naturalHeight: number;
    naturalWidth: number;
    get promise(): Promise<void>;
    sourceSet: SourceSet;
    constructor(options?: ImageOptions);
    load(): Promise<void>;
    setLoadMode(value: LoadMode): void;
    setSource(value: string): void;
    setVisible(value: boolean): void;
    update(): void;
    protected allowLoad(): boolean;
    onConnected(): void;
    onDisconnected(): void;
    protected onResize(): (() => void) | undefined;
}
