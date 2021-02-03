import { __extends } from "tslib";
import { Adapter } from './Adapter';
import { noop } from '../../../utils/lang/function';
var NativeAdapter = /** @class */ (function (_super) {
    __extends(NativeAdapter, _super);
    function NativeAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeAdapter.prototype.getCurrentTime = function () {
        return this.el.currentTime;
    };
    NativeAdapter.prototype.getDuration = function () {
        return this.el.duration;
    };
    NativeAdapter.prototype.getVolume = function () {
        return this.el.volume;
    };
    NativeAdapter.prototype.mute = function () {
        this.el.muted = true;
    };
    NativeAdapter.prototype.pause = function () {
        this.el.pause();
    };
    NativeAdapter.prototype.play = function () {
        try {
            var el = this.el;
            var promise = el.play();
            if (promise) {
                promise.catch(noop);
            }
        }
        catch (e) { }
    };
    NativeAdapter.prototype.setCurrentTime = function (value, options) {
        if (options === void 0) { options = {}; }
        this.el.currentTime = value;
    };
    NativeAdapter.prototype.setVolume = function (volume) {
        this.el.volume = volume;
    };
    NativeAdapter.prototype.unmute = function () {
        this.el.muted = false;
    };
    return NativeAdapter;
}(Adapter));
export { NativeAdapter };
