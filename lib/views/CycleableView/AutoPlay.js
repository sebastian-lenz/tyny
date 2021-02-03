import { __assign, __extends } from "tslib";
import { Behaviour } from '../../core/Behaviour';
import { transistEvent } from './index';
import { off, on } from '../../utils/dom/event/on';
var AutoPlay = /** @class */ (function (_super) {
    __extends(AutoPlay, _super);
    function AutoPlay(view, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, view, __assign({ interval: 5000 }, options)) || this;
        _this.id = Math.round(Math.random() * 1024);
        _this.isStarted = false;
        _this._timeout = null;
        _this.onTimeout = function () {
            var view = _this.view;
            _this._timeout = null;
            view.currentIndex = view.currentIndex + 1;
            _this.start();
        };
        _this.onTransist = function () {
            if (_this._timeout) {
                _this.start();
            }
        };
        var _a = options.autoStart, autoStart = _a === void 0 ? true : _a, _b = options.interval, interval = _b === void 0 ? 5000 : _b;
        _this.interval = interval;
        on(_this.el, transistEvent, _this.onTransist);
        if (autoStart) {
            _this.start();
        }
        return _this;
    }
    AutoPlay.prototype.pause = function () {
        var _timeout = this._timeout;
        if (_timeout) {
            clearTimeout(_timeout);
            this._timeout = null;
        }
        this.isStarted = false;
    };
    AutoPlay.prototype.start = function () {
        var _a = this, interval = _a.interval, onTimeout = _a.onTimeout, _timeout = _a._timeout;
        if (_timeout) {
            clearTimeout(_timeout);
        }
        this.isStarted = true;
        this._timeout = window.setTimeout(onTimeout, interval);
    };
    AutoPlay.prototype.onDestroyed = function () {
        off(this.el, transistEvent, this.onTransist);
    };
    return AutoPlay;
}(Behaviour));
export { AutoPlay };
