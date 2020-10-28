import { Adapter } from './Adapter';
import { noop } from '../../../utils/lang/function';

export class NativeAdapter extends Adapter<HTMLVideoElement> {
  getCurrentTime() {
    return this.el.currentTime;
  }

  getDuration() {
    return this.el.duration;
  }

  getVolume() {
    return this.el.volume;
  }

  mute() {
    this.el.muted = true;
  }

  pause() {
    this.el.pause();
  }

  play() {
    try {
      const el: HTMLVideoElement = this.el as any;
      const promise = el.play();
      if (promise) {
        promise.catch(noop);
      }
    } catch (e) {}
  }

  setCurrentTime(value: number, options: any = {}) {
    this.el.currentTime = value;
  }

  setVolume(volume: number) {
    this.el.volume = volume;
  }

  unmute() {
    this.el.muted = false;
  }
}
