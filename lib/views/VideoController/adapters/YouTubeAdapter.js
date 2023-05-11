import { on, once, trigger } from '../../../utils/dom/event';
import { IFrameAdapter } from './IFrameAdapter';
import { videoTimeEvent } from '../index';
export var YoutTubePlayerState;
(function (YoutTubePlayerState) {
    YoutTubePlayerState[YoutTubePlayerState["Unknown"] = -1] = "Unknown";
    YoutTubePlayerState[YoutTubePlayerState["Ended"] = 0] = "Ended";
    YoutTubePlayerState[YoutTubePlayerState["Playing"] = 1] = "Playing";
    YoutTubePlayerState[YoutTubePlayerState["Paused"] = 2] = "Paused";
    YoutTubePlayerState[YoutTubePlayerState["Buffering"] = 3] = "Buffering";
    YoutTubePlayerState[YoutTubePlayerState["Cued"] = 5] = "Cued";
})(YoutTubePlayerState || (YoutTubePlayerState = {}));
/**
 * Potential calls are listed in `info.apiInterface`:
 * onInitialDelivery() { console.log(info.apiInterface); }
 */
export class YouTubeAdapter extends IFrameAdapter {
    constructor() {
        super(...arguments);
        this.info = null;
    }
    getCurrentTime() {
        const { info } = this;
        return info ? info.currentTime : 0;
    }
    getDuration() {
        const { info } = this;
        return info ? info.duration : 0;
    }
    getVolume() {
        const { info } = this;
        return info ? info.volume : 0;
    }
    mute() {
        this.post({ func: 'mute' });
    }
    play() {
        this.post({ func: 'playVideo' });
    }
    pause() {
        this.post({ func: 'pauseVideo' });
    }
    setCurrentTime(seconds, { allowSeekAhead = false } = {}) {
        this.post({ func: 'seekTo', args: [seconds, !!allowSeekAhead] });
    }
    setVolume(volume) {
        this.post({ func: 'setVolume', args: [volume] });
    }
    unmute() {
        this.post({ func: 'unMute' });
    }
    createApi() {
        const { el, uid, url } = this;
        let pollInterval = 0;
        const pollCallback = () => {
            this.postNative({ event: 'listening', id: this.uid });
        };
        const startPolling = () => {
            pollInterval = setInterval(pollCallback, 100);
            pollCallback();
            this.listeners.push(on(window, 'message', this.onMessage, { scope: this }));
        };
        if (!url.getParam('enablejsapi')) {
            once(el, 'load', startPolling);
            this.url = url.setParam('enablejsapi', '1');
        }
        else {
            startPolling();
        }
        this.listeners.push(() => clearInterval(pollInterval));
        return new Promise((resolve) => {
            this.awaitMessage(({ event, id }) => parseInt(id) == uid && event === 'onReady').then(() => {
                clearInterval(pollInterval);
                resolve();
            });
        });
    }
    onInitialDelivery(info) {
        this.info = info;
        trigger(this.el, videoTimeEvent, {
            currentTime: info.currentTime,
            duration: info.duration,
        });
    }
    onInfoDelivery(changed) {
        const info = this.info || (this.info = {});
        Object.assign(info, changed);
        if (changed.currentTime || changed.duration) {
            trigger(this.el, videoTimeEvent, {
                currentTime: info.currentTime,
                duration: info.duration,
            });
        }
    }
    onMessage(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.id !== this.uid) {
                return;
            }
            const { event: type } = data;
            if (type === 'initialDelivery') {
                this.onInitialDelivery(data.info);
            }
            else if (type === 'infoDelivery') {
                this.onInfoDelivery(data.info);
            }
        }
        catch (error) {
            // Unreadable message
        }
    }
}
