import { __assign, __decorate, __extends } from "tslib";
import { DragScrollBehaviour } from './DragScrollBehaviour';
import { stop } from '../../fx/dispatcher';
import { transform } from '../../utils/env/transformProps';
import { tween } from '../../fx/tween';
import { View, update, property } from '../../core';
import { findAll } from '../../utils/dom/node';
var createBounds = function () { return ({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
}); };
export var scrollerScrollEvent = 'tyny:scrollerScroll';
var Scroller = /** @class */ (function (_super) {
    __extends(Scroller, _super);
    function Scroller(options) {
        var _this = _super.call(this, options) || this;
        _this.currentTarget = null;
        _this.currentTween = null;
        _this.positionBounds = createBounds();
        _this.viewportSize = { width: 0, height: 0 };
        var _a = options.direction, direction = _a === void 0 ? 'both' : _a, _b = options.position, position = _b === void 0 ? { x: 0, y: 0 } : _b;
        _this.direction = direction;
        _this._position = __assign({}, position);
        _this.dragBehaviour = _this.addBehaviour(DragScrollBehaviour, {
            direction: direction,
            view: _this,
        });
        return _this;
    }
    Object.defineProperty(Scroller.prototype, "items", {
        get: function () {
            return findAll(this.itemSelector, this.content || this.el);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "isPositionPaged", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scroller.prototype, "position", {
        get: function () {
            var _a = this._position, x = _a.x, y = _a.y;
            return { x: x, y: y };
        },
        set: function (value) {
            this.setPosition(value);
        },
        enumerable: false,
        configurable: true
    });
    Scroller.prototype.clampPosition = function (value) {
        var _a = this.positionBounds, xMin = _a.xMin, xMax = _a.xMax, yMin = _a.yMin, yMax = _a.yMax;
        var x = value.x, y = value.y;
        if (x > xMax)
            x = xMax;
        if (x < xMin)
            x = xMin;
        if (y > yMax)
            y = yMax;
        if (y < yMin)
            y = yMin;
        return { x: x, y: y };
    };
    Scroller.prototype.gotoPosition = function (value) {
        stop(this);
        this.position = this.clampPosition(value);
    };
    Scroller.prototype.setPosition = function (value) {
        var _a = this, _position = _a._position, content = _a.content, direction = _a.direction;
        if (direction !== 'vertical')
            _position.x = value.x;
        if (direction !== 'horizontal')
            _position.y = value.y;
        if (content) {
            var _b = this.toDisplayOffset(_position), x = _b.x, y = _b.y;
            content.style[transform] = "translate(" + -x + "px, " + -y + "px)";
        }
        this.trigger(scrollerScrollEvent, {
            target: this,
            position: __assign({}, _position),
        });
    };
    Scroller.prototype.toDisplayOffset = function (value) {
        return value;
    };
    Scroller.prototype.toLocalOffset = function (value) {
        return value;
    };
    Scroller.prototype.tweenTo = function (position, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var currentTween = this.currentTween;
        this.currentTarget = position;
        if (currentTween) {
            currentTween.advance({ position: position }, options);
        }
        else {
            this.currentTween = currentTween = tween(this, { position: position }, __assign(__assign({}, options), { rejectOnStop: true }));
            var reset = function () { return (_this.currentTween = _this.currentTarget = null); };
            currentTween.then(reset, reset);
        }
    };
    // Protected methods
    // -----------------
    Scroller.prototype.onMeasure = function () {
        var _a = this, content = _a.content, useContentMargins = _a.useContentMargins, viewport = _a.viewport, viewportSize = _a.viewportSize;
        var bounds = this.positionBounds;
        if (!content || !viewport) {
            return;
        }
        var height = (viewportSize.width = viewport.offsetHeight);
        var width = (viewportSize.width = viewport.offsetWidth);
        bounds.xMin = 0;
        bounds.xMax = content.scrollWidth - width;
        bounds.yMin = 0;
        bounds.yMax = content.scrollHeight - height;
        if (useContentMargins) {
            var style = window.getComputedStyle(content);
            bounds.xMax +=
                parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            bounds.yMax +=
                parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
    };
    Scroller.prototype.onResize = function () {
        stop(this);
        this.position = this.clampPosition(this.position);
    };
    __decorate([
        property({ param: { type: 'element' } })
    ], Scroller.prototype, "content", void 0);
    __decorate([
        property({ param: { defaultValue: '> *', type: 'string' } })
    ], Scroller.prototype, "items", null);
    __decorate([
        property({ param: { defaultValue: '> *', type: 'string' } })
    ], Scroller.prototype, "itemSelector", void 0);
    __decorate([
        property({ param: { defaultValue: true, type: 'bool' } })
    ], Scroller.prototype, "useContentMargins", void 0);
    __decorate([
        property({ param: { defaultValue: ':scope', type: 'element' } })
    ], Scroller.prototype, "viewport", void 0);
    __decorate([
        update({ mode: 'read', events: ['resize', 'update'] })
    ], Scroller.prototype, "onMeasure", null);
    __decorate([
        update({ mode: 'write', events: 'resize' })
    ], Scroller.prototype, "onResize", null);
    return Scroller;
}(View));
export { Scroller };
