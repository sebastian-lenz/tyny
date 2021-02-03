import { __extends } from "tslib";
import { AbstractAdapter } from './AbstractAdapter';
import { isUndefined } from '../../../utils/lang/misc';
var isSupported = undefined;
var id = function (event) { return "pointer-" + event.pointerId; };
var PointerAdapter = /** @class */ (function (_super) {
    __extends(PointerAdapter, _super);
    function PointerAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PointerAdapter.prototype.getEvents = function () {
        return {
            pointerdown: this.handlePointerDown,
        };
    };
    PointerAdapter.prototype.getTrackingEvents = function () {
        return {
            pointermove: this.handlePointerMove,
            pointerup: this.handlePointerUp,
            pointercancel: this.handlePointerUp,
        };
    };
    PointerAdapter.prototype.handlePointerDown = function (event) {
        if (event.button !== 0) {
            return;
        }
        this.pointerList.addPointer(event, {
            adapter: this,
            clientX: event.clientX,
            clientY: event.clientY,
            id: id(event),
            type: event.pointerType,
        });
    };
    PointerAdapter.prototype.handlePointerMove = function (event) {
        this.pointerList.movePointer(event, id(event), {
            clientX: event.clientX,
            clientY: event.clientY,
        });
    };
    PointerAdapter.prototype.handlePointerUp = function (event) {
        this.pointerList.removePointer(event, id(event));
    };
    PointerAdapter.isSupported = function () {
        if (!isUndefined(isSupported)) {
            return isSupported;
        }
        isSupported = 'PointerEvent' in window;
        if (isSupported) {
            try {
                window.addEventListener('pointermove', function () { }, {
                    passive: false,
                });
            }
            catch (e) {
                window.addEventListener('pointermove', function () { });
            }
        }
        return isSupported;
    };
    return PointerAdapter;
}(AbstractAdapter));
export { PointerAdapter };
