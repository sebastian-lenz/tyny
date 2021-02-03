import { IFrameAdapter } from './IFrameAdapter';
export declare class VimeoAdapter extends IFrameAdapter {
    constructor(el: HTMLIFrameElement);
    play(): void;
    pause(): void;
    mute(): void;
    protected createApi(): Promise<void>;
}
