import { Adapter } from './adapters/Adapter';
import { createAdapter } from './adapters';
import { View, ViewDestroyOptions, ViewOptions } from '../../core';

export const videoTimeEvent = 'tyny:videoTime';

export interface VideoTimerEventArgs {
  currentTime: number;
  duration: number;
}

export interface VideoControllerOptions extends ViewOptions {}

export class VideoController extends View {
  readonly adapter: Adapter;

  constructor(options: VideoControllerOptions) {
    super(options);

    this.adapter = createAdapter(this.el);
  }

  get currentTime(): number {
    return this.adapter.getCurrentTime();
  }

  set currentTime(value: number) {
    this.adapter.setCurrentTime(value);
  }

  get duration(): number {
    return this.adapter.getDuration();
  }

  destroy(options?: ViewDestroyOptions | undefined): void {
    this.adapter.destroy();
  }

  mute() {
    this.adapter.mute();
  }

  pause() {
    this.adapter.pause();
  }

  play() {
    this.adapter.play();
  }

  setCurrentTime(value: number, options: any = {}) {
    this.adapter.setCurrentTime(value, options);
  }
}
