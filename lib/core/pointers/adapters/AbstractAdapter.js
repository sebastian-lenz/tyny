import { on } from '../../../utils/dom/event/on';
var AbstractAdapter = /** @class */ (function () {
    function AbstractAdapter(element, pointerList) {
        var _this = this;
        this._isTracking = false;
        this._listeners = null;
        this._trackingListeners = null;
        this.element = element;
        this.pointerList = pointerList;
        var events = this.getEvents();
        this._listeners = Object.keys(events).map(function (name) {
            return on(element, name, events[name], {
                scope: _this,
            });
        });
    }
    AbstractAdapter.prototype.dispose = function () {
        var _listeners = this._listeners;
        if (_listeners) {
            _listeners.forEach(function (off) { return off(); });
        }
        this._listeners = null;
        this.stopTracking();
    };
    AbstractAdapter.prototype.updateTracking = function () {
        if (this.pointerList.hasPointersOfAdapter(this)) {
            this.startTracking();
        }
        else {
            this.stopTracking();
        }
    };
    AbstractAdapter.prototype.startTracking = function () {
        var _this = this;
        if (this._isTracking)
            return;
        var events = this.getTrackingEvents();
        this._isTracking = true;
        this._trackingListeners = Object.keys(events).map(function (name) {
            return on(document.documentElement, name, events[name], {
                passive: false,
                scope: _this,
            });
        });
    };
    AbstractAdapter.prototype.stopTracking = function () {
        var _a = this, _isTracking = _a._isTracking, _trackingListeners = _a._trackingListeners;
        if (!_isTracking)
            return;
        if (_trackingListeners) {
            _trackingListeners.forEach(function (off) { return off(); });
        }
        this._isTracking = false;
        this._trackingListeners = null;
    };
    return AbstractAdapter;
}());
export { AbstractAdapter };
