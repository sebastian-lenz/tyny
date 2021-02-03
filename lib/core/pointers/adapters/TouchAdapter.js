import { __extends } from "tslib";
import { AbstractAdapter } from './AbstractAdapter';
import { MouseAdapter } from './MouseAdapter';
var iIOSFix = false;
var id = function (touch) { return "touch-" + touch.identifier; };
var each = function (touches, callback) {
    for (var index = 0; index < touches.length; index += 1) {
        callback(touches[index]);
    }
};
var TouchAdapter = /** @class */ (function (_super) {
    __extends(TouchAdapter, _super);
    function TouchAdapter(element, pointerList) {
        var _this = _super.call(this, element, pointerList) || this;
        _this.mouseAdapter = new MouseAdapter(element, pointerList);
        return _this;
    }
    TouchAdapter.prototype.getEvents = function () {
        return {
            touchstart: this.handleTouchStart,
        };
    };
    TouchAdapter.prototype.getTrackingEvents = function () {
        return {
            touchmove: this.handleTouchMove,
            touchend: this.handleTouchEnd,
            touchcancel: this.handleTouchEnd,
        };
    };
    TouchAdapter.prototype.handleTouchStart = function (event) {
        var _this = this;
        each(event.changedTouches, function (touch) {
            _this.pointerList.addPointer(event, {
                adapter: _this,
                clientX: touch.clientX,
                clientY: touch.clientY,
                id: id(touch),
                type: 'touch',
            });
        });
    };
    TouchAdapter.prototype.handleTouchMove = function (event) {
        var _this = this;
        each(event.changedTouches, function (touch) {
            _this.pointerList.movePointer(event, id(touch), {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
        });
    };
    TouchAdapter.prototype.handleTouchEnd = function (event) {
        var _this = this;
        this.mouseAdapter.mute();
        each(event.changedTouches, function (touch) {
            _this.pointerList.removePointer(event, id(touch));
        });
    };
    TouchAdapter.isSupported = function () {
        if (iIOSFix) {
            return true;
        }
        var isSupported = 'ontouchstart' in window;
        if (isSupported) {
            iIOSFix = true;
            window.addEventListener('touchmove', function () { }, { passive: false });
        }
        return isSupported;
    };
    return TouchAdapter;
}(AbstractAdapter));
export { TouchAdapter };
