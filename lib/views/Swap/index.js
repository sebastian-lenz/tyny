import { __assign, __extends } from "tslib";
import { fade } from '../../fx/transitions/fade';
import { removeNode } from '../../utils/dom/node';
import { Sequencer } from '../Slideshow/Sequencer';
import { View } from '../../core/View';
import { transistDimensions, } from '../../fx/transistDimensions';
export var swapEndEvent = 'tyny:swapEnd';
export var swapStartEvent = 'tyny:swapStart';
var Swap = /** @class */ (function (_super) {
    __extends(Swap, _super);
    function Swap(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._content = null;
        _this.autoAppend = options.autoAppend || false;
        _this.autoRemove = options.autoRemove || false;
        _this.dimensions = options.dimensions || null;
        _this.selectedClass = options.selectedClass || 'selected';
        _this.transition = options.transition || fade();
        _this._content = _this.params.element({ name: 'content' }) || null;
        _this.viewport = _this.params.element({
            defaultValue: _this.el,
            name: 'viewport',
        });
        _this.sequencer = new Sequencer({
            callbackContext: _this,
            dismissCallback: _this.onTransitionDismiss,
            endCallback: _this.onTransitionEnd,
            startCallback: _this.onTransitionStart,
        });
        return _this;
    }
    Object.defineProperty(Swap.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (value) {
            this.setContent(value);
        },
        enumerable: false,
        configurable: true
    });
    Swap.prototype.setContent = function (value, options) {
        if (value === void 0) { value = null; }
        if (options === void 0) { options = {}; }
        var _a = this, dimensions = _a.dimensions, content = _a.content, sequencer = _a.sequencer, transition = _a.transition;
        if (content === value) {
            return;
        }
        this._content = value;
        sequencer.transist(__assign(__assign({ transition: transition,
            dimensions: dimensions }, options), { from: content, to: value }));
    };
    Swap.prototype.onTransitionDismiss = function (_a) {
        var to = _a.to;
        if (to && this.autoRemove) {
            removeNode(to);
        }
    };
    Swap.prototype.onTransitionStart = function (_a) {
        var dimensions = _a.dimensions, from = _a.from, to = _a.to;
        var _b = this, autoAppend = _b.autoAppend, selectedClass = _b.selectedClass, viewport = _b.viewport;
        var callback = function () {
            if (from)
                from.classList.remove(selectedClass);
            if (to)
                to.classList.add(selectedClass);
        };
        if (to && autoAppend) {
            viewport.appendChild(to);
        }
        if (dimensions) {
            transistDimensions(this.viewport, callback, dimensions);
        }
        else {
            callback();
        }
        this.trigger(swapStartEvent, {
            from: from,
            target: this,
            to: to,
        });
    };
    Swap.prototype.onTransitionEnd = function (_a) {
        var from = _a.from, to = _a.to;
        if (from && this.autoRemove) {
            removeNode(from);
        }
        this.trigger(swapEndEvent, {
            from: from,
            target: this,
            to: to,
        });
    };
    return Swap;
}(View));
export { Swap };
