import { __extends } from "tslib";
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
var YouTubeAdapter = /** @class */ (function (_super) {
    __extends(YouTubeAdapter, _super);
    function YouTubeAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.info = null;
        return _this;
    }
    YouTubeAdapter.prototype.getCurrentTime = function () {
        var info = this.info;
        return info ? info.currentTime : 0;
    };
    YouTubeAdapter.prototype.getDuration = function () {
        var info = this.info;
        return info ? info.duration : 0;
    };
    YouTubeAdapter.prototype.getVolume = function () {
        var info = this.info;
        return info ? info.volume : 0;
    };
    YouTubeAdapter.prototype.mute = function () {
        this.post({ func: 'mute' });
    };
    YouTubeAdapter.prototype.play = function () {
        this.post({ func: 'playVideo' });
    };
    YouTubeAdapter.prototype.pause = function () {
        this.post({ func: 'pauseVideo' });
    };
    YouTubeAdapter.prototype.setCurrentTime = function (seconds, _a) {
        var _b = (_a === void 0 ? {} : _a).allowSeekAhead, allowSeekAhead = _b === void 0 ? false : _b;
        this.post({ func: 'seekTo', args: [seconds, !!allowSeekAhead] });
    };
    YouTubeAdapter.prototype.setVolume = function (volume) {
        this.post({ func: 'setVolume', args: [volume] });
    };
    YouTubeAdapter.prototype.unmute = function () {
        this.post({ func: 'unMute' });
    };
    YouTubeAdapter.prototype.createApi = function () {
        var _this = this;
        var _a = this, el = _a.el, uid = _a.uid, url = _a.url;
        var pollInterval = 0;
        var pollCallback = function () {
            _this.postNative({ event: 'listening', id: _this.uid });
        };
        var startPolling = function () {
            pollInterval = setInterval(pollCallback, 100);
            pollCallback();
            on(window, 'message', _this.onMessage, { scope: _this });
        };
        if (!url.getParam('enablejsapi')) {
            once(el, 'load', startPolling);
            this.url = url.setParam('enablejsapi', '1');
        }
        else {
            startPolling();
        }
        return new Promise(function (resolve) {
            _this.awaitMessage(function (_a) {
                var event = _a.event, id = _a.id;
                return parseInt(id) == uid && event === 'onReady';
            }).then(function () {
                clearInterval(pollInterval);
                resolve();
            });
        });
    };
    YouTubeAdapter.prototype.onInitialDelivery = function (info) {
        this.info = info;
        trigger(this.el, videoTimeEvent, {
            currentTime: info.currentTime,
            duration: info.duration,
        });
    };
    YouTubeAdapter.prototype.onInfoDelivery = function (changed) {
        var info = this.info || (this.info = {});
        Object.assign(info, changed);
        if (changed.currentTime || changed.duration) {
            trigger(this.el, videoTimeEvent, {
                currentTime: info.currentTime,
                duration: info.duration,
            });
        }
    };
    YouTubeAdapter.prototype.onMessage = function (event) {
        try {
            var data = JSON.parse(event.data);
            if (data.id !== this.uid) {
                return;
            }
            var type = data.event;
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
    };
    return YouTubeAdapter;
}(IFrameAdapter));
export { YouTubeAdapter };
