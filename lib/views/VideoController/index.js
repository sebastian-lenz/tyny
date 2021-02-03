import { __extends } from "tslib";
import { createAdapter } from './adapters';
import { View } from '../../core';
export var videoTimeEvent = 'tyny:videoTime';
var VideoController = /** @class */ (function (_super) {
    __extends(VideoController, _super);
    function VideoController(options) {
        var _this = _super.call(this, options) || this;
        _this.adapter = createAdapter(_this.el);
        return _this;
    }
    Object.defineProperty(VideoController.prototype, "currentTime", {
        get: function () {
            return this.adapter.getCurrentTime();
        },
        set: function (value) {
            this.adapter.setCurrentTime(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(VideoController.prototype, "duration", {
        get: function () {
            return this.adapter.getDuration();
        },
        enumerable: false,
        configurable: true
    });
    VideoController.prototype.mute = function () {
        this.adapter.mute();
    };
    VideoController.prototype.pause = function () {
        this.adapter.pause();
    };
    VideoController.prototype.play = function () {
        this.adapter.play();
    };
    VideoController.prototype.setCurrentTime = function (value, options) {
        if (options === void 0) { options = {}; }
        this.adapter.setCurrentTime(value, options);
    };
    return VideoController;
}(View));
export { VideoController };
