import { IFrameAdapter } from './IFrameAdapter';
import type { AdapterSetCurrentTimeOptions } from './Adapter';
export declare enum YoutTubePlayerState {
    Unknown = -1,
    Ended = 0,
    Playing = 1,
    Paused = 2,
    Buffering = 3,
    Cued = 5
}
export interface YouTubeStateInfo {
    apiInterface: string[];
    availablePlaybackRates: number[];
    availableQualityLevels: string[];
    currentTime: number;
    currentTimeLastUpdated_: number;
    debugText: string;
    duration: number;
    mediaReferenceTime: number;
    muted: boolean;
    option: any;
    options: Array<any>;
    playbackQuality: string;
    playbackRate: number;
    playerState: number;
    playlist: any | null;
    playlistId: any | null;
    playlistIndex: number;
    sphericalProperties: any;
    videoBytesLoaded: number;
    videoBytesTotal: number;
    videoData: {
        video_id: string;
        author: string;
        title: string;
    };
    videoEmbedCode: string;
    videoInfoVisible: boolean;
    videoLoadedFraction: number;
    videoStartBytes: number;
    videoUrl: string;
    volume: number;
}
export declare class YouTubeAdapter extends IFrameAdapter {
    info: YouTubeStateInfo | null;
    messageHandler: {
        (message: any): void;
    } | null;
    getCurrentTime(): number;
    getDuration(): number;
    getVolume(): number;
    mute(): void;
    play(): void;
    pause(): void;
    setCurrentTime(seconds: number, { allowSeekAhead }?: AdapterSetCurrentTimeOptions): void;
    setVolume(volume: number): void;
    unmute(): void;
    protected createApi(): Promise<void>;
    protected onInitialDelivery(info: YouTubeStateInfo): void;
    protected onInfoDelivery(changed: Partial<YouTubeStateInfo>): void;
    protected onMessage(event: MessageEvent): void;
}
