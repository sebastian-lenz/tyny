import { __assign, __extends } from "tslib";
import { AutoPlay } from '../CycleableView/AutoPlay';
import { CycleableView } from '../CycleableView';
import { dissolve } from '../../fx/transitions/dissolve';
import { Sequencer } from './Sequencer';
import { BrowseBehaviour } from './BrowseBehaviour';
export var slideshowDismissEvent = 'tyny:slideshowDismiss';
export var slideshowEndEvent = 'tyny:slideshowEnd';
export var slideshowStartEvent = 'tyny:slideshowStart';
var Slideshow = /** @class */ (function (_super) {
    __extends(Slideshow, _super);
    function Slideshow(options) {
        var _this = _super.call(this, __assign({ initialIndex: 0, isLooped: true }, options)) || this;
        _this.wasAutoPlaying = false;
        _this.autoPlay = _this.addBehaviour(AutoPlay, options.autoPlay);
        _this.browseBehaviour = _this.addBehaviour(BrowseBehaviour, options.browse);
        _this.defaultTransition = options.transition || dissolve();
        _this.sequencer = new Sequencer({
            callbackContext: _this,
            dismissCallback: _this.onTransitionDismiss,
            endCallback: _this.onTransitionEnd,
            startCallback: _this.onTransitionStart,
        });
        return _this;
    }
    Object.defineProperty(Slideshow.prototype, "inTransition", {
        get: function () {
            return this.sequencer.inTransition();
        },
        enumerable: false,
        configurable: true
    });
    Slideshow.prototype.immediate = function (value) {
        this.transist(value, { transition: function () { return Promise.resolve(); } });
    };
    Slideshow.prototype.onBrowseBegin = function () {
        if (this.inTransition) {
            return false;
        }
        this.wasAutoPlaying = this.autoPlay.isStarted;
        this.autoPlay.pause();
        return true;
    };
    Slideshow.prototype.onBrowseEnd = function () {
        if (this.wasAutoPlaying) {
            this.autoPlay.start();
        }
    };
    Slideshow.prototype.onTransition = function (from, to, options) {
        if (options === void 0) { options = {}; }
        var _a = this, defaultTransition = _a.defaultTransition, sequencer = _a.sequencer;
        var transition = from ? defaultTransition : function () { return Promise.resolve(); };
        sequencer.transist(__assign({ transition: transition,
            from: from,
            to: to }, options));
    };
    Slideshow.prototype.onTransitionDismiss = function (_a) {
        var from = _a.from, to = _a.to;
        this.trigger(slideshowDismissEvent, {
            from: from,
            target: this,
            to: to,
        });
    };
    Slideshow.prototype.onTransitionEnd = function (_a) {
        var from = _a.from, to = _a.to;
        this.trigger(slideshowEndEvent, {
            from: from,
            target: this,
            to: to,
        });
    };
    Slideshow.prototype.onTransitionStart = function (_a) {
        var from = _a.from, to = _a.to;
        if (from) {
            from.classList.remove('selected');
        }
        if (to) {
            to.classList.add('selected');
        }
        this.trigger(slideshowStartEvent, {
            from: from,
            target: this,
            to: to,
        });
    };
    return Slideshow;
}(CycleableView));
export { Slideshow };
