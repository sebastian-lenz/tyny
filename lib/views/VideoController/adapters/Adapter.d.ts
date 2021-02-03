export interface AdapterSetCurrentTimeOptions {
    allowSeekAhead?: boolean;
}
export declare abstract class Adapter<TElement extends HTMLElement = HTMLElement> {
    readonly el: TElement;
    protected uid: number;
    constructor(el: TElement);
    enableApi(): Promise<void>;
    getCurrentTime(): number;
    getDuration(): number;
    getVolume(): number;
    mute(): void;
    pause(): void;
    play(): void;
    setCurrentTime(value: number, options?: AdapterSetCurrentTimeOptions): void;
    setVolume(volume: number): void;
    unmute(): void;
}
