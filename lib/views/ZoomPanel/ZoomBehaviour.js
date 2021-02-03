import { __extends } from "tslib";
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { stop } from '../../fx/dispatcher';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { tween } from '../../fx/tween';
var ZoomBehaviour = /** @class */ (function (_super) {
    __extends(ZoomBehaviour, _super);
    function ZoomBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.initialPosition = { x: 0, y: 0 };
        _this.initialScale = 0;
        _this.isActive = false;
        return _this;
    }
    ZoomBehaviour.prototype.onTransformBegin = function (event, pointer) {
        var view = this.view;
        var _a = view.position, x = _a.x, y = _a.y, scale = view.scale;
        this.initialPosition = { x: x, y: y };
        this.initialScale = scale;
        stop(view);
        return true;
    };
    ZoomBehaviour.prototype.onTransform = function (event, pointer) {
        var _a = this, center = _a.center, initialPosition = _a.initialPosition, initialScale = _a.initialScale, transform = _a.transform, view = _a.view;
        var _b = view.getScaleBounds(), max = _b.max, min = _b.min;
        var scale = initialScale;
        scale *= transform.scale;
        if (!isFinite(scale))
            scale = initialScale;
        if (scale < min)
            scale = min + (scale - min) * 0.25;
        if (scale > max)
            scale = max + (scale - max) * 0.25;
        var _c = view.getPositionBounds(scale), xMax = _c.xMax, xMin = _c.xMin, yMax = _c.yMax, yMin = _c.yMin;
        var _d = view.el.getBoundingClientRect(), left = _d.left, top = _d.top;
        var x = center.x - left;
        var y = center.y - top;
        x += ((initialPosition.x - x) / initialScale) * scale + transform.x;
        y += ((initialPosition.y - y) / initialScale) * scale + transform.y;
        if (x < xMin)
            x = xMin + (x - xMin) * 0.5;
        if (x > xMax)
            x = xMax + (x - xMax) * 0.5;
        if (y < yMin)
            y = yMin + (y - yMin) * 0.5;
        if (y > yMax)
            y = yMax + (y - yMax) * 0.5;
        view.setPosition({ x: x, y: y });
        view.setScale(scale);
        return true;
    };
    ZoomBehaviour.prototype.onTransformEnd = function (event, pointer) {
        var view = this.view;
        var position = view.position, initialScale = view.scale;
        var scale = view.limitScale(initialScale);
        if (this.pointers.length > 1) {
            var _a = view.el.getBoundingClientRect(), left = _a.left, top_1 = _a.top;
            var center = this.center;
            var x = center.x - left;
            var y = center.y - top_1;
            x += ((position.x - x) / initialScale) * scale;
            y += ((position.y - y) / initialScale) * scale;
            tween(view, {
                position: view.limitPosition({ x: x, y: y }, scale),
                scale: scale,
            }, {
                easing: easeOutExpo,
            });
        }
        else {
            var bounds = view.getPositionBounds(scale);
            var velocity = this.velocity.get();
            momentum(view, {
                position: {
                    velocity: { x: velocity.x, y: velocity.y },
                    max: { x: bounds.xMax, y: bounds.yMax },
                    min: { x: bounds.xMin, y: bounds.yMin },
                },
            });
        }
    };
    return ZoomBehaviour;
}(TransformBehaviour));
export { ZoomBehaviour };
