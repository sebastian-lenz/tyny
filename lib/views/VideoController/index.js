import { createAdapter } from './adapters';
import { View } from '../../core';
export const videoTimeEvent = 'tyny:videoTime';
export class VideoController extends View {
    constructor(options) {
        super(options);
        this.adapter = createAdapter(this.el);
    }
    get currentTime() {
        return this.adapter.getCurrentTime();
    }
    set currentTime(value) {
        this.adapter.setCurrentTime(value);
    }
    get duration() {
        return this.adapter.getDuration();
    }
    destroy(options) {
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
    setCurrentTime(value, options = {}) {
        this.adapter.setCurrentTime(value, options);
    }
}
