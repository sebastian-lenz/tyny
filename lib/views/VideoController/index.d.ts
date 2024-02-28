import { Adapter } from './adapters/Adapter';
import { View, ViewDestroyOptions, ViewOptions } from '../../core';
export interface VideoControllerOptions extends ViewOptions {
}
export declare class VideoController extends View {
    readonly adapter: Adapter;
    constructor(options: VideoControllerOptions);
    get currentTime(): number;
    set currentTime(value: number);
    get duration(): number;
    destroy(options?: ViewDestroyOptions | undefined): void;
    mute(): void;
    pause(): void;
    play(): void;
    setCurrentTime(value: number, options?: any): void;
}
