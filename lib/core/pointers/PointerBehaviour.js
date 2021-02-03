import { __decorate, __extends } from "tslib";
import { Behaviour } from '../Behaviour';
import { createAdapter } from './adapters';
import { event } from '../decorators';
import { Pointer } from './Pointer';
import { Transform2D } from '../../utils/types/Transform2D';
import { Velocity } from './Velocity';
var createVelocity = function () { return ({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 0,
}); };
var toVelocity = function (transform) { return ({
    x: transform.x,
    y: transform.y,
    rotation: transform.rotation,
    scale: transform.scale,
}); };
var length = function (x, y) { return Math.sqrt(x * x + y * y); };
var PointerBehaviour = /** @class */ (function (_super) {
    __extends(PointerBehaviour, _super);
    function PointerBehaviour(view, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, view, options) || this;
        //
        _this.initialCenter = { x: 0, y: 0 };
        _this.initialTransform = Transform2D.identity();
        _this.pointers = [];
        _this.velocity = new Velocity(createVelocity);
        _this.adapter = null;
        _this.adapter = createAdapter(options.target || view.el, _this);
        return _this;
    }
    Object.defineProperty(PointerBehaviour.prototype, "center", {
        get: function () {
            var pointers = this.pointers;
            var weight = pointers.length ? 1 / pointers.length : 0;
            return pointers.reduce(function (result, pointer) {
                result.x += pointer.clientX * weight;
                result.y += pointer.clientY * weight;
                return result;
            }, { x: 0, y: 0 });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointerBehaviour.prototype, "transform", {
        get: function () {
            var _a = this, initialCenter = _a.initialCenter, initialTransform = _a.initialTransform, pointers = _a.pointers;
            if (pointers.length === 0) {
                return Transform2D.identity();
            }
            if (pointers.length === 1) {
                var p = pointers[0];
                return Transform2D.translation(p.clientX - p.initialTransformClientX, p.clientY - p.initialTransformClientY).multiply(initialTransform);
            }
            var center = this.center;
            var weight = 1 / pointers.length;
            var scale = 0;
            var rotate = 0;
            pointers.forEach(function (p) {
                var aX = p.initialTransformClientX - initialCenter.x;
                var aY = p.initialTransformClientY - initialCenter.y;
                var bX = p.clientX - center.x;
                var bY = p.clientY - center.y;
                scale += (length(bX, bY) / length(aX, aY)) * weight;
                rotate += (Math.atan2(bY, bX) - Math.atan2(aY, aX)) * weight;
            });
            var result = Transform2D.translation(center.x - initialCenter.x, center.y - initialCenter.y).multiply(initialTransform);
            result.rotation += rotate;
            result.scale *= scale;
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PointerBehaviour.prototype, "hasPointers", {
        get: function () {
            return !!this.pointers.length;
        },
        enumerable: false,
        configurable: true
    });
    PointerBehaviour.prototype.addPointer = function (event, options) {
        var _this = this;
        var pointer = new Pointer(options);
        if (this.onAdd(event, pointer)) {
            this.commit(event, pointer, function () {
                _this.pointers.push(pointer);
            });
        }
    };
    PointerBehaviour.prototype.hasPointersOfAdapter = function (adapter) {
        return this.pointers.some(function (pointer) { return pointer.adapter === adapter; });
    };
    PointerBehaviour.prototype.removePointer = function (event, id) {
        var pointers = this.pointers;
        var index = pointers.findIndex(function (pointer) { return pointer.id === id; });
        if (index !== -1) {
            var pointer = pointers[index];
            this.onRemove(event, pointer);
            this.commit(event, pointer, function () {
                pointers.splice(index, 1);
            });
        }
    };
    PointerBehaviour.prototype.removeAllPointers = function () {
        var pointers = this.pointers;
        while (pointers.length) {
            this.removePointer(undefined, pointers[0].id);
        }
    };
    PointerBehaviour.prototype.movePointer = function (event, id, options) {
        var pointers = this.pointers;
        var index = pointers.findIndex(function (pointer) { return pointer.id === id; });
        if (index !== -1) {
            var pointer = pointers[index];
            pointer.move(options);
            if (this.onMove(event, pointer)) {
                this.velocity.push(toVelocity(this.transform));
            }
            else {
                this.removePointer(event, pointer.id);
            }
        }
    };
    /**
     * Prevent all drag events from heppaning inside elements that
     * we control mouse events on. Fixes drag behviour in firefox.
     */
    PointerBehaviour.prototype.onNativeDragStart = function (event) {
        event.preventDefault();
    };
    // Behaviour API
    // -------------
    PointerBehaviour.prototype.onAdd = function (event, pointer) {
        return true;
    };
    PointerBehaviour.prototype.onChanged = function (event, pointer) { };
    PointerBehaviour.prototype.onMove = function (event, pointer) {
        return true;
    };
    PointerBehaviour.prototype.onRemove = function (event, pointer) { };
    // Private methods
    // ---------------
    PointerBehaviour.prototype.onDestroyed = function () {
        _super.prototype.onDestroyed.call(this);
        if (this.adapter) {
            this.adapter.dispose();
            this.adapter = null;
        }
    };
    PointerBehaviour.prototype.commit = function (event, pointer, callback) {
        var _a = this, adapter = _a.adapter, initialCenter = _a.initialCenter, initialTransform = _a.initialTransform, pointers = _a.pointers;
        initialTransform.copyFrom(this.transform);
        callback();
        if (pointers.length) {
            var center = this.center;
            initialCenter.x = center.x;
            initialCenter.y = center.y;
            pointers.forEach(function (pointer) {
                pointer.initialTransformClientX = pointer.clientX;
                pointer.initialTransformClientY = pointer.clientY;
            });
        }
        else {
            initialCenter.x = 0;
            initialCenter.y = 0;
            initialTransform.identity();
        }
        this.velocity.push(toVelocity(this.transform));
        if (adapter) {
            adapter.updateTracking();
        }
        this.onChanged(event, pointer);
    };
    __decorate([
        event({ name: 'dragstart' })
    ], PointerBehaviour.prototype, "onNativeDragStart", null);
    return PointerBehaviour;
}(Behaviour));
export { PointerBehaviour };
