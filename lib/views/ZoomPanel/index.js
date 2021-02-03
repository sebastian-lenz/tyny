import { __decorate, __extends } from "tslib";
import { update, View } from '../../core';
import { stop } from '../../fx/dispatcher';
import { WheelBehaviour } from './WheelBehaviour';
import { ZoomBehaviour } from './ZoomBehaviour';
var ZoomPanel = /** @class */ (function (_super) {
    __extends(ZoomPanel, _super);
    function ZoomPanel(options) {
        var _this = _super.call(this, options) || this;
        _this.fitPadding = 0;
        _this.height = 0;
        _this.position = { x: 0, y: 0 };
        _this.scale = 1;
        _this.width = 0;
        _this.zoomBehaviour = _this.addBehaviour(ZoomBehaviour);
        _this.wheelBehaviour = _this.addBehaviour(WheelBehaviour);
        return _this;
    }
    ZoomPanel.prototype.fitToView = function () {
        var _a = this, height = _a.height, fitPadding = _a.fitPadding, width = _a.width;
        var nativeHeight = this.getNativeHeight();
        var nativeWidth = this.getNativeWidth();
        var scale = Math.min(1, (height - fitPadding * 2) / nativeHeight, (width - fitPadding * 2) / nativeWidth);
        var displayWidth = nativeWidth * scale;
        var displayHeight = nativeHeight * scale;
        var x = (width - displayWidth) * 0.5;
        var y = (height - displayHeight) * 0.5;
        stop(this);
        this.setPosition({ x: x, y: y });
        this.setScale(scale);
    };
    ZoomPanel.prototype.getPositionBounds = function (scale) {
        if (scale === void 0) { scale = this.scale; }
        var _a = this, height = _a.height, width = _a.width;
        var nativeHeight = this.getNativeHeight();
        var nativeWidth = this.getNativeWidth();
        var displayWidth = nativeWidth * scale;
        var displayHeight = nativeHeight * scale;
        var x = (width - displayWidth) * 0.5;
        var y = (height - displayHeight) * 0.5;
        return {
            xMax: Math.max(x, 0),
            xMin: Math.min(x, width - displayWidth),
            yMax: Math.max(y, 0),
            yMin: Math.min(y, height - displayHeight),
        };
    };
    ZoomPanel.prototype.getScaleBounds = function () {
        var _a = this, height = _a.height, padding = _a.fitPadding, width = _a.width;
        var nativeHeight = this.getNativeHeight();
        var nativeWidth = this.getNativeWidth();
        var scale = Math.min(1, (height - padding * 2) / nativeHeight, (width - padding * 2) / nativeWidth);
        return {
            min: scale,
            max: 1,
        };
    };
    ZoomPanel.prototype.limitPosition = function (_a, scale) {
        var x = _a.x, y = _a.y;
        if (scale === void 0) { scale = this.scale; }
        var _b = this.getPositionBounds(scale), xMax = _b.xMax, xMin = _b.xMin, yMin = _b.yMin, yMax = _b.yMax;
        if (x < xMin)
            x = xMin;
        if (x > xMax)
            x = xMax;
        if (y < yMin)
            y = yMin;
        if (y > yMax)
            y = yMax;
        return { x: x, y: y };
    };
    ZoomPanel.prototype.limitScale = function (scale) {
        var _a = this.getScaleBounds(), max = _a.max, min = _a.min;
        if (scale < min)
            scale = min;
        if (scale > max)
            scale = max;
        return scale;
    };
    ZoomPanel.prototype.setPosition = function (_a) {
        var x = _a.x, y = _a.y;
        var position = this.position;
        if (position.x === x && position.y === y)
            return;
        position.x = x;
        position.y = y;
        this.draw();
    };
    ZoomPanel.prototype.setScale = function (value) {
        if (this.scale === value)
            return;
        this.scale = value;
        this.draw();
    };
    ZoomPanel.prototype.onMeasure = function () {
        var _this = this;
        var el = this.el;
        this.height = el.offsetHeight;
        this.width = el.offsetWidth;
        return function () {
            _this.fitToView();
        };
    };
    __decorate([
        update({ events: 'resize', mode: 'read' })
    ], ZoomPanel.prototype, "onMeasure", null);
    return ZoomPanel;
}(View));
export { ZoomPanel };
