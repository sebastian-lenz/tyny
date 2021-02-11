import { on } from '../../../utils/dom/event/on';
import { PointerBehaviour } from '../PointerBehaviour';

export abstract class AbstractAdapter {
  readonly element: HTMLElement;
  readonly pointerList: PointerBehaviour;
  private _isTracking: boolean = false;
  private _listeners: Array<Function> | null = null;
  private _trackingListeners: Array<Function> | null = null;

  constructor(element: HTMLElement, pointerList: PointerBehaviour) {
    this.element = element;
    this.pointerList = pointerList;

    const events = this.getEvents();
    this._listeners = Object.keys(events).map((name) =>
      on(element, name, events[name], {
        scope: this,
      })
    );
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
    } else {
      this.stopTracking();
    }
  }

  protected abstract getEvents(): tyny.Map<EventListener>;

  protected abstract getTrackingEvents(): tyny.Map<EventListener>;

  protected startTracking() {
    if (this._isTracking) return;
    const events = this.getTrackingEvents();

    this._isTracking = true;
    this._trackingListeners = Object.keys(events).map((name) =>
      on(window, name, events[name], {
        passive: false,
        scope: this,
      })
    );
  }

  protected stopTracking() {
    const { _isTracking, _trackingListeners } = this;
    if (!_isTracking) return;
    if (_trackingListeners) {
      _trackingListeners.forEach((off) => off());
    }

    this._isTracking = false;
    this._trackingListeners = null;
  }
}
