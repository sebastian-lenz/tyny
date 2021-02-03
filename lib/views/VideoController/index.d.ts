import { Adapter } from './adapters/Adapter';
import { View, ViewOptions } from '../../core';
export declare const videoTimeEvent = "tyny:videoTime";
export interface VideoTimerEventArgs {
    currentTime: number;
    duration: number;
}
export interface VideoControllerOptions extends ViewOptions {
}
export declare class VideoController extends View {
    readonly adapter: Adapter;
    constructor(options: VideoControllerOptions);
    get currentTime(): number;
    set currentTime(value: number);
    get duration(): number;
    mute(): void;
    pause(): void;
    play(): void;
    setCurrentTime(value: number, options?: any): void;
}
