import { NativeAdapter } from './NativeAdapter';
import { NullAdapter } from './NullAdapter';
import { YouTubeAdapter } from './YouTubeAdapter';
import { VimeoAdapter } from './VimeoAdapter';
export function isNative(el) {
    return el.tagName === 'VIDEO';
}
export function isIFrame(el) {
    return el.tagName === 'IFRAME';
}
export function isYoutube(el) {
    return (isIFrame(el) &&
        !!el.src.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/));
}
export function isVimeo(el) {
    return isIFrame(el) && !!el.src.match(/vimeo\.com\/video\/.*/);
}
export function isVideo(el) {
    return isYoutube(el) || isVimeo(el) || isNative(el);
}
export function createAdapter(el) {
    if (isNative(el)) {
        return new NativeAdapter(el);
    }
    else if (isYoutube(el)) {
        return new YouTubeAdapter(el);
    }
    else if (isVimeo(el)) {
        return new VimeoAdapter(el);
    }
    return new NullAdapter(el);
}
