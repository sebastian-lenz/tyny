import { Adapter } from './Adapter';
import { NativeAdapter } from './NativeAdapter';
import { NullAdapter } from './NullAdapter';
import { YouTubeAdapter } from './YouTubeAdapter';
import { VimeoAdapter } from './VimeoAdapter';

export function isNative(el: HTMLElement): el is HTMLVideoElement {
  return el.tagName === 'VIDEO';
}

export function isIFrame(el: HTMLElement): el is HTMLIFrameElement {
  return el.tagName === 'IFRAME';
}

export function isYoutube(el: HTMLElement): el is HTMLIFrameElement {
  return (
    isIFrame(el) &&
    !!el.src.match(
      /\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/
    )
  );
}

export function isVimeo(el: HTMLElement): el is HTMLIFrameElement {
  return isIFrame(el) && !!el.src.match(/vimeo\.com\/video\/.*/);
}

export function isVideo(el: HTMLElement): boolean {
  return isYoutube(el) || isVimeo(el) || isNative(el);
}

export function createAdapter(el: HTMLElement): Adapter {
  if (isNative(el)) {
    return new NativeAdapter(el);
  } else if (isYoutube(el)) {
    return new YouTubeAdapter(el);
  } else if (isVimeo(el)) {
    return new VimeoAdapter(el);
  }

  return new NullAdapter(el);
}
