import { on } from '../../../utils/dom/event/on';
export class AbstractAdapter {
    constructor(element, pointerList) {
        this.usePassiveEvents = true;
        this._isTracking = false;
        this._listeners = null;
        this._trackingListeners = null;
        this.element = element;
        this.pointerList = pointerList;
        const events = this.getEvents();
        this._listeners = Object.keys(events).map((name) => on(element, name, events[name], {
            scope: this,
        }));
    }
    dispose() {
        const { _listeners } = this;
        if (_listeners) {
            _listeners.forEach((off) => off());
        }
        this._listeners = null;
        this.stopTracking();
    }
    updateTracking() {
        if (this.pointerList.hasPointersOfAdapter(this)) {
            this.startTracking();
        }
        else {
            this.stopTracking();
        }
    }
    startTracking() {
        if (this._isTracking)
            return;
        const events = this.getTrackingEvents();
        this._isTracking = true;
        this._trackingListeners = Object.keys(events).map((name) => on(window, name, events[name], {
            passive: this.usePassiveEvents,
            scope: this,
        }));
    }
    stopTracking() {
        const { _isTracking, _trackingListeners } = this;
        if (!_isTracking)
            return;
        if (_trackingListeners) {
            _trackingListeners.forEach((off) => off());
        }
        this._isTracking = false;
        this._trackingListeners = null;
    }
}
