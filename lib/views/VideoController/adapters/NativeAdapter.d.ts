import { Adapter } from './Adapter';
export declare class NativeAdapter extends Adapter<HTMLVideoElement> {
    getCurrentTime(): number;
    getDuration(): number;
    getVolume(): number;
    mute(): void;
    pause(): void;
    play(): void;
    setCurrentTime(value: number, options?: any): void;
    setVolume(volume: number): void;
    unmute(): void;
}
