import { __assign, __extends, __rest } from "tslib";
import { easeInOutQuad } from '../../fx/easings/easeInOutQuad';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import { SlideEffect } from './effects/SlideEffect';
import { tween } from '../../fx/tween';
import { DragBehaviour, } from '../../core/pointers/DragBehaviour';
var BrowseBehaviour = /** @class */ (function (_super) {
    __extends(BrowseBehaviour, _super);
    function BrowseBehaviour(view, _a) {
        var _b = _a.enabled, enabled = _b === void 0 ? true : _b, _c = _a.effect, effect = _c === void 0 ? new SlideEffect() : _c, options = __rest(_a, ["enabled", "effect"]);
        var _this = _super.call(this, view, __assign({ direction: 'horizontal' }, options)) || this;
        _this.initialOffset = 0;
        _this.offset = null;
        _this._preventNextClick = false;
        _this.enabled = enabled;
        _this.effect = effect;
        _this._listeners = [
            on(view.el, 'click', _this.onViewClick, { capture: true, scope: _this }),
        ];
        return _this;
    }
    BrowseBehaviour.prototype.setOffset = function (value) {
        var _a = this, effect = _a.effect, offset = _a.offset, view = _a.view;
        if (offset === value) {
            return;
        }
        this.offset = value;
        if (value === null) {
            effect.clear();
        }
        else {
            var index = value !== null ? Math.floor(value) : Number.NaN;
            var from = view.at(view.normalizeIndex(index));
            var to = view.at(view.normalizeIndex(index + 1));
            effect.apply(from, to, value - index);
        }
    };
    // Drag API
    // --------
    BrowseBehaviour.prototype.onDragBegin = function (event, pointer) {
        var _a = this, offset = _a.offset, view = _a.view;
        if (view.length < 2 || !view.onBrowseBegin() || !this.enabled) {
            return false;
        }
        this.initialOffset = offset === null ? view.currentIndex : offset;
        this.setOffset(this.initialOffset);
        stop(view);
        stop(this);
        view.immediate(null);
        event.preventDefault();
        return true;
    };
    BrowseBehaviour.prototype.onDrag = function (event, pointer) {
        var _a = this, direction = _a.direction, initialOffset = _a.initialOffset, view = _a.view;
        var _b = view.viewport, viewport = _b === void 0 ? view.el : _b;
        event.preventDefault();
        var delta = pointer.delta;
        var offset = initialOffset;
        if (direction === 'horizontal') {
            offset -= delta.x / viewport.clientWidth;
        }
        else {
            offset -= delta.y / viewport.clientHeight;
        }
        this.setOffset(offset);
        return true;
    };
    BrowseBehaviour.prototype.onDragEnd = function (event, pointer) {
        var _this = this;
        var view = this.view;
        this._preventNextClick = true;
        var force = this.getForce(pointer);
        var offset = this.getOffsetTarget(force);
        var options = {
            easing: Math.abs(force) < 2 ? easeInOutQuad : easeOutExpo,
        };
        tween(this, { offset: offset }, options).then(function () {
            _this.setOffset(null);
            view.onBrowseEnd();
            view.immediate(view.at(view.normalizeIndex(offset)));
        });
    };
    // Protected methods
    // -----------------
    BrowseBehaviour.prototype.getForce = function (pointer) {
        var _a = pointer.velocity.get(), clientX = _a.clientX, clientY = _a.clientY;
        return this.direction === 'horizontal' ? clientX : clientY;
    };
    BrowseBehaviour.prototype.getOffsetTarget = function (force) {
        var offset = this.offset || 0;
        if (force < -5) {
            return Math.ceil(offset);
        }
        else if (force > 5) {
            return Math.floor(offset);
        }
        return Math.round(offset);
    };
    BrowseBehaviour.prototype.onDestroyed = function () {
        _super.prototype.onDestroyed.call(this);
        if (this._listeners) {
            this._listeners.forEach(function (off) { return off(); });
            this._listeners = null;
        }
    };
    BrowseBehaviour.prototype.onViewClick = function (event) {
        if (this._preventNextClick) {
            this._preventNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    return BrowseBehaviour;
}(DragBehaviour));
export { BrowseBehaviour };
