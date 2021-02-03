import { Adapter } from './Adapter';
export declare function isNative(el: HTMLElement): el is HTMLVideoElement;
export declare function isIFrame(el: HTMLElement): el is HTMLIFrameElement;
export declare function isYoutube(el: HTMLElement): el is HTMLIFrameElement;
export declare function isVimeo(el: HTMLElement): el is HTMLIFrameElement;
export declare function isVideo(el: HTMLElement): boolean;
export declare function createAdapter(el: HTMLElement): Adapter;
