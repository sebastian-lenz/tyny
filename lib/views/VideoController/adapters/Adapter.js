let nextUid = 1465;
export class Adapter {
    constructor(el) {
        this.el = el;
        this.uid = nextUid++;
    }
    enableApi() {
        return Promise.resolve();
    }
    getCurrentTime() {
        return 0;
    }
    getDuration() {
        return 0;
    }
    getVolume() {
        return 0;
    }
    mute() { }
    pause() { }
    play() { }
    setCurrentTime(value, options = {}) { }
    setVolume(volume) { }
    unmute() { }
}
