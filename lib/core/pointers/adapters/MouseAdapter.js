import { __extends } from "tslib";
import { AbstractAdapter } from './AbstractAdapter';
var MouseAdapter = /** @class */ (function (_super) {
    __extends(MouseAdapter, _super);
    function MouseAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseAdapter.prototype.getEvents = function () {
        return {
            mousedown: this.handleMouseDown,
        };
    };
    MouseAdapter.prototype.getTrackingEvents = function () {
        return {
            mousemove: this.handleMouseMove,
            mouseup: this.handleMouseUp,
        };
    };
    MouseAdapter.prototype.mute = function () {
        var _this = this;
        if (this.muteTimeout)
            clearTimeout(this.muteTimeout);
        this.muteTimeout = window.setTimeout(function () { return (_this.muteTimeout = undefined); }, 500);
    };
    MouseAdapter.prototype.handleMouseDown = function (event) {
        if (this.muteTimeout)
            return;
        this.pointerList.addPointer(event, {
            adapter: this,
            clientX: event.clientX,
            clientY: event.clientY,
            id: 'mouse',
            type: 'mouse',
        });
    };
    MouseAdapter.prototype.handleMouseMove = function (event) {
        this.pointerList.movePointer(event, 'mouse', {
            clientX: event.clientX,
            clientY: event.clientY,
        });
    };
    MouseAdapter.prototype.handleMouseUp = function (event) {
        this.pointerList.removePointer(event, 'mouse');
    };
    MouseAdapter.isSupported = function () {
        return true;
    };
    return MouseAdapter;
}(AbstractAdapter));
export { MouseAdapter };
