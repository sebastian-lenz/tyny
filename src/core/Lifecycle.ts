import { fastDom, FastDomTask } from './components';
import { isEqual } from '../utils/lang/object/isEqual';
import { isFunction } from '../utils/lang/function/isFunction';
import { isString } from '../utils/lang/string';
import { on } from '../utils/dom/event/on';

import type {
  EventHandler,
  PropertyHandler,
  UpdateHandler,
} from './decorators';

export abstract class Lifecycle {
  private _eventListeners: Array<Function> | null = null;
  private _isConnected: boolean = false;
  private _updatesTasks: Array<FastDomTask | null> | null = null;
  private _watchTask: FastDomTask | null = null;
  private _watchValues: tyny.AnyObject | null = null;

  private readonly _events!: tyny.Map<EventHandler>;
  private readonly _updates!: tyny.Map<UpdateHandler>;
  private readonly _properties!: tyny.Map<PropertyHandler>;

  get isConnected(): boolean {
    return this._isConnected;
  }

  callUpdate(type?: string) {
    if (!type || type === 'update' || type === 'resize') {
      this._watch();
    }

    const updates = Object.values(this._updates);
    if (!updates.length) {
      return;
    }

    const tasks = this._updatesTasks || (this._updatesTasks = []);
    updates.forEach(({ events, handler, mode }, index) => {
      if (tasks[index] || (type && !events.includes(type))) {
        return;
      }

      tasks[index] = fastDom[mode](() => {
        if (this.isConnected) {
          const result = (<any>this)[handler].call(this, type);
          if (typeof result === 'function') {
            fastDom.writes.push(result.bind(this));
          }
        }

        tasks[index] = null;
      });
    });
  }

  destroy() {
    this._callDisconnected();
    this.onDestroyed();
  }

  // Abstract memebers
  // -----------------

  abstract get el(): HTMLElement;

  // Internal hooks
  // --------------

  protected onConnected() {}

  protected onDestroyed() {}

  protected onDisconnected() {}

  // View API
  // --------

  protected _callConnected() {
    if (this._isConnected) return;
    this._isConnected = true;

    this._bindEvents();
    this.onConnected();
  }

  protected _callDisconnected() {
    if (!this._isConnected) return;
    this._isConnected = false;

    this._unbindEvents();
    this.onDisconnected();
  }

  // Private methods
  // ---------------

  private _bindEvent(
    this: Lifecycle & tyny.Map<EventListener>,
    listeners: Array<Function>,
    event: EventHandler
  ): Array<Function> {
    let { name, target, handler, selector, filter, ...args } = event;
    target = isFunction(target) ? target.call(this) : target || this.el;

    if (Array.isArray(target)) {
      return target.reduce(
        (listeners, target) => this._bindEvent(listeners, { ...event, target }),
        listeners
      );
    }

    if (target && (!filter || filter.call(this))) {
      listeners.push(
        on(target, name, this[handler], {
          ...args,
          selector: isFunction(selector) ? selector.call(this) : selector,
          scope: this,
        })
      );
    }

    return listeners;
  }

  protected _bindEvents() {
    if (this._eventListeners) {
      this._unbindEvents();
    }

    const _events = Object.values(this._events);
    this._eventListeners = _events
      ? _events.reduce(this._bindEvent.bind(this as any), [])
      : null;
  }

  protected _unbindEvents() {
    const listeners = this._eventListeners;
    this._eventListeners = null;

    if (listeners) {
      listeners.forEach((unbind) => unbind());
    }
  }

  private _watch() {
    const properties = Object.values(this._properties);
    if (this._watchTask || !properties.length) {
      return;
    }

    this._watchTask = fastDom.read(() => {
      if (this._isConnected) {
        this._watchWorker(properties);
      }

      this._watchTask = null;
    });
  }

  private _watchWorker(
    this: Lifecycle & tyny.Map<any>,
    properties: PropertyHandler[]
  ) {
    const isInitital = !this._watchValues;
    const values = this._watchValues || (this._watchValues = {});

    for (let index = 0; index < properties.length; index++) {
      const { immediate, immutable, name, watch } = properties[index];
      if (isInitital && immediate && !watch) this[name];
      if (immutable) continue;
      if (!watch) {
        delete values[name];
        continue;
      }

      const hasPrev = values.hasOwnProperty(name);
      const prev = values[name];
      delete values[name];

      if (
        (isInitital && immediate) ||
        (hasPrev && !isEqual(prev, this[name]))
      ) {
        isString(watch)
          ? this[watch](this[name], prev)
          : watch.call(this, this[name], prev);
      }
    }
  }
}

Object.assign(Lifecycle.prototype, {
  _events: {},
  _updates: {},
  _properties: {},
});
