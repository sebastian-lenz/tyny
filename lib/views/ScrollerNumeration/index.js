import { __decorate, __extends } from "tslib";
import { AbstractNumeration } from '../Numeration/AbstractNumeration';
import { clamp } from '../../utils/lang/number';
import { easeInOutCubic } from '../../fx/easings/easeInOutCubic';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import { property, update } from '../../core';
import { Scroller, scrollerScrollEvent } from '../Scroller';
var ScrollerNumeration = /** @class */ (function (_super) {
    __extends(ScrollerNumeration, _super);
    function ScrollerNumeration() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._height = 0;
        _this._rects = [];
        _this._targetListeners = null;
        _this._width = 0;
        return _this;
    }
    Object.defineProperty(ScrollerNumeration.prototype, "target", {
        get: function () {
            var target = this.params.read({ name: 'target' });
            if (target instanceof Scroller) {
                return target;
            }
            else if (isString(target)) {
                return this.findView(target, Scroller);
            }
            else {
                return null;
            }
        },
        enumerable: false,
        configurable: true
    });
    ScrollerNumeration.prototype.onMeasure = function () {
        var _this = this;
        var target = this.target;
        if (!target)
            return;
        var items = target.items, viewport = target.viewport, position = target.position;
        var scrollX = position.x, scrollY = position.y;
        if (!viewport)
            return;
        var bounds = viewport.getBoundingClientRect();
        var boundsX = bounds.left, boundsY = bounds.top;
        var rects = items.map(function (item) {
            var _a = item.getBoundingClientRect(), height = _a.height, width = _a.width, x = _a.left, y = _a.top;
            x = x - boundsX + scrollX;
            y = y - boundsY + scrollY;
            return {
                xMax: x + width,
                yMax: y + height,
                xMin: x,
                yMin: y,
            };
        });
        this._height = bounds.height;
        this._rects = rects;
        this._width = bounds.width;
        this.setLength(rects.length);
        return function () { return _this.updateSelected(position); };
    };
    ScrollerNumeration.prototype.onScrollChanged = function (event) {
        this.updateSelected(event.detail.position);
    };
    ScrollerNumeration.prototype.onTargetChanged = function (target) {
        var _targetListeners = this._targetListeners;
        if (_targetListeners) {
            _targetListeners.forEach(function (off) { return off(); });
        }
        if (target) {
            var el = target.el;
            this._targetListeners = [
                on(el, scrollerScrollEvent, this.onScrollChanged, { scope: this }),
            ];
            this.setLength(target.items.length);
        }
    };
    ScrollerNumeration.prototype.selectIndex = function (index) {
        var _a = this, target = _a.target, _rects = _a._rects;
        var _b = _rects[index], x = _b.xMin, y = _b.yMin;
        if (target) {
            var duration = clamp(Math.sqrt(x * x + y * y) * 100, 250, 600);
            target.tweenTo(target.clampPosition({ x: x, y: y }), {
                duration: duration,
                easing: easeInOutCubic,
            });
        }
    };
    ScrollerNumeration.prototype.updateSelected = function (position) {
        var _a = this, _height = _a._height, _rects = _a._rects, _width = _a._width;
        var x = position.x, y = position.y;
        var max = -1;
        var min = -1;
        for (var index = 0; index < _rects.length; index++) {
            var rect = _rects[index];
            if (rect.xMax - x < 0 || rect.yMax - y < 0)
                continue;
            if (rect.xMin - x > _width || rect.yMin - y > _height)
                break;
            if (min === -1)
                min = index;
            max = index;
        }
        this.setSelected({ min: min, max: max });
    };
    __decorate([
        property({ immediate: true, watch: 'onTargetChanged' })
    ], ScrollerNumeration.prototype, "target", null);
    __decorate([
        update({ events: ['resize'], mode: 'read' })
    ], ScrollerNumeration.prototype, "onMeasure", null);
    return ScrollerNumeration;
}(AbstractNumeration));
export { ScrollerNumeration };
