import { __extends } from "tslib";
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import { DragBehaviour, } from '../../core/pointers/DragBehaviour';
var DragScrollBehaviour = /** @class */ (function (_super) {
    __extends(DragScrollBehaviour, _super);
    function DragScrollBehaviour(view, options) {
        var _this = _super.call(this, view, options) || this;
        _this.isDraging = false;
        _this._preventNextClick = false;
        _this.initialPosition = view.position;
        var listeners = (_this._listeners = [
            on(view.el, 'click', _this.onViewClick, { capture: true, scope: _this }),
        ]);
        if (!options.disableWheel) {
            listeners.push(on(view.el, 'wheel', _this.onWheel, { scope: _this }));
        }
        return _this;
    }
    // Drag API
    // --------
    DragScrollBehaviour.prototype.onDragBegin = function (event, pointer) {
        var _a = this, direction = _a.direction, view = _a.view;
        stop(view);
        var _b = view.positionBounds, xMin = _b.xMin, xMax = _b.xMax, yMin = _b.yMin, yMax = _b.yMax;
        var xDiff = Math.max(0, xMax - xMin);
        var yDiff = Math.max(0, yMax - yMin);
        var canScroll = (direction !== 'vertical' && xDiff > 0) ||
            (direction !== 'horizontal' && yDiff > 0);
        if (!canScroll) {
            return false;
        }
        this.isDraging = true;
        this.initialPosition = view.position;
        event.preventDefault();
        return true;
    };
    DragScrollBehaviour.prototype.onDrag = function (event, pointer) {
        var _a = this, direction = _a.direction, initialPosition = _a.initialPosition, view = _a.view;
        event.preventDefault();
        var delta = view.toLocalOffset(pointer.delta);
        var _b = view.positionBounds, xMin = _b.xMin, xMax = _b.xMax, yMin = _b.yMin, yMax = _b.yMax;
        var x = initialPosition.x, y = initialPosition.y;
        if (direction !== 'vertical') {
            x -= delta.x;
            if (x > xMax)
                x = xMax + (x - xMax) * 0.5;
            if (x < xMin)
                x = xMin + (x - xMin) * 0.5;
        }
        if (direction !== 'horizontal') {
            y -= delta.y;
            if (y > yMax)
                y = yMax + (y - yMax) * 0.5;
            if (y < yMin)
                y = yMin + (y - yMin) * 0.5;
        }
        view.position = { x: x, y: y };
        return true;
    };
    DragScrollBehaviour.prototype.onDragEnd = function (event, pointer) {
        var view = this.view;
        var velocity = this.getVelocity(pointer);
        this._preventNextClick = true;
        this.isDraging = false;
        if (view.isPositionPaged) {
            var position = view.position;
            position.x += velocity.x * 10;
            position.y += velocity.y * 10;
            view.tweenTo(view.clampPosition(position), { easing: easeOutExpo });
        }
        else {
            var _a = view.positionBounds, xMin = _a.xMin, xMax = _a.xMax, yMin = _a.yMin, yMax = _a.yMax;
            momentum(view, {
                position: {
                    velocity: velocity,
                    min: { x: xMin, y: yMin },
                    max: { x: xMax, y: yMax },
                },
            });
        }
    };
    // Protected methods
    // -----------------
    DragScrollBehaviour.prototype.getVelocity = function (pointer) {
        var _a = this, direction = _a.direction, view = _a.view;
        var _b = pointer.velocity.get(), clientX = _b.clientX, clientY = _b.clientY;
        var velocity = { x: 0, y: 0 };
        if (direction !== 'vertical') {
            velocity.x = -clientX;
        }
        if (direction !== 'horizontal') {
            velocity.y = -clientY;
        }
        return view.toLocalOffset(velocity);
    };
    DragScrollBehaviour.prototype.onDestroyed = function () {
        _super.prototype.onDestroyed.call(this);
        if (this._listeners) {
            this._listeners.forEach(function (off) { return off(); });
            this._listeners = null;
        }
    };
    DragScrollBehaviour.prototype.onViewClick = function (event) {
        if (this._preventNextClick) {
            this._preventNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
    };
    DragScrollBehaviour.prototype.onWheel = function (event) {
        if (this.isDraging || this.isDisabled) {
            return;
        }
        var _a = this, direction = _a.direction, view = _a.view;
        var position = view.position;
        var didUpdate = false;
        var delta = view.toLocalOffset({
            x: event.deltaX,
            y: event.deltaY,
        });
        if (direction !== 'vertical') {
            position.x += delta.x;
            didUpdate = didUpdate || Math.abs(event.deltaX) > 0;
        }
        if (direction !== 'horizontal') {
            position.y += delta.y;
            didUpdate = didUpdate || Math.abs(event.deltaY) > 0;
        }
        if (didUpdate) {
            event.preventDefault();
        }
        stop(view);
        view.position = view.clampPosition(position);
    };
    return DragScrollBehaviour;
}(DragBehaviour));
export { DragScrollBehaviour };
