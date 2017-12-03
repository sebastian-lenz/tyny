import { once, uniqueId } from 'tyny-utils';

import Event from './Event';

export type EventCallback = {
  (event: any): void;
  _callback?: Function;
};

export type EventListener = {
  count: number;
  emitter: EventEmitter;
  emitterId: string;
  id: string;
  listeningTo: EventListenerMap;
};

export type EventListenerMap = {
  [id: string]: EventListener;
};

export type EventHandler = {
  callback: EventCallback;
  context: any;
  ctx: any;
  listening: EventListener | null;
  priority: number;
};

export type EventHandlerMap = {
  [name: string]: EventHandler[];
};

/**
 * An event dispatcher.
 *
 * Based on Backbone.Events
 * http://backbonejs.org/backbone.js
 */
export default class EventEmitter {
  private _events: EventHandlerMap | null = null;
  private _listenId: string | null = null;
  private _listeners: EventListenerMap | null = null;
  private _listeningTo: EventListenerMap | null = null;

  /**
   * Disposes this instance.
   */
  dispose() {
    this.off();
    this.stopListening();
  }

  /**
   * Trigger an event, firing all bound callbacks.
   */
  emit(event: Event): this {
    const events = this._events;
    if (!events) return this;

    const typeHandlers = events[event.type];
    const allHandlers = events['all'];
    const handlers = [
      ...(typeHandlers ? typeHandlers : []),
      ...(allHandlers ? allHandlers : []),
    ];

    for (let index = 0; index < handlers.length; index++) {
      const { callback, context } = handlers[index];
      callback.call(context, event);
      if (event.isPropagationStopped()) {
        break;
      }
    }

    return this;
  }

  /**
   * Inversion-of-control versions of `on`.
   *
   * Tell *this* object to listen to an event in another object, keeping
   * track of what it's listening to for easier unbinding later.
   */
  listenTo(
    emitter: EventEmitter,
    type: string,
    callback: EventCallback,
    priority?: number
  ): this {
    if (!emitter) return this;
    const emitterId = emitter.getListenId();
    const listeningTo = this._listeningTo || (this._listeningTo = {});
    let listening = listeningTo[emitterId];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      listening = {
        count: 0,
        emitter,
        emitterId,
        id: this.getListenId(),
        listeningTo,
      };

      listeningTo[emitterId] = listening;
    }

    // Bind callbacks on obj, and keep track of them on listening.
    emitter.addHandler(type, callback, this, listening, priority);
    return this;
  }

  /**
   * Inversion-of-control versions of `once`.
   */
  listenToOnce(
    emitter: EventEmitter,
    type: string,
    callback: EventCallback,
    priority?: number
  ): this {
    const onceCallback = this.createOnceHandler(
      callback,
      (onceCallback: EventCallback) => {
        this.stopListening(emitter, type, onceCallback);
      }
    );

    return this.listenTo(emitter, type, onceCallback, priority);
  }

  /**
   * Remove one or many callbacks.
   *
   * If `context` is null, removes all callbacks with that function.
   * If `callback` is null, removes all callbacks for the event.
   * If `name` is null, removes all bound callbacks for all events.
   */
  off(type?: string, callback?: EventCallback, context?: any): this {
    const events = this._events;
    const listeners = this._listeners;
    if (events === null) return this;

    // Delete all events listeners and "drop" events.
    if (!type && !callback && !context) {
      if (listeners) {
        const ids = Object.keys(listeners);
        for (let i = 0; i < ids.length; i++) {
          const listening = listeners[ids[i]];
          delete listeners[listening.id];
          delete listening.listeningTo[listening.emitterId];
        }
      }

      this._events = null;
      return this;
    }

    const names = type ? [type] : Object.keys(events);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const handlers = events[name];
      if (!handlers) break;

      // Replace events if there are any remaining.  Otherwise, clean up.
      const remaining = [];
      for (let j = 0; j < handlers.length; j++) {
        const handler = handlers[j];
        if (
          (callback &&
            (callback !== handler.callback &&
              callback !== handler.callback._callback)) ||
          (context && context !== handler.context)
        ) {
          remaining.push(handler);
        } else {
          const { listening } = handler;
          if (listening && --listening.count === 0 && listeners) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.emitterId];
          }
        }
      }

      // Update tail event if the list has any events.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }

    return this;
  }

  /**
   * Bind an event to a `callback` function.
   *
   * Passing `"all"` will bind the callback to all events fired.
   */
  on(
    type: string,
    callback: EventCallback,
    context?: any,
    priority?: number
  ): this {
    return this.addHandler(type, callback, context, null, priority);
  }

  /*
   * Bind an event to only be triggered a single time.
   *
   * After the first time the callback is invoked, its listener will be
   * removed.
   */
  once(
    type: string,
    callback: EventCallback,
    context?: any,
    priority?: number
  ): this {
    const onceCallback = this.createOnceHandler(
      callback,
      (onceCallback: EventCallback) => {
        this.off(type, onceCallback);
      }
    );

    return this.addHandler(type, onceCallback, context, null, priority);
  }

  /**
   * Tell this object to stop listening to either specific events or
   * to every object it's currently listening to.
   */
  stopListening(
    obj?: EventEmitter,
    name?: string,
    callback?: EventCallback
  ): this {
    const listeningTo = this._listeningTo;
    if (!listeningTo) return this;
    if (obj && !obj._listenId) return this;

    const ids = obj
      ? [obj._listenId ? obj._listenId : '']
      : Object.keys(listeningTo);

    for (let i = 0; i < ids.length; i++) {
      const listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;
      listening.emitter.off(name, callback, this);
    }

    return this;
  }

  /**
   * Guard the `listening` argument from the public API.
   */
  private addHandler(
    type: string,
    callback: EventCallback,
    context?: any,
    listening: EventListener | null = null,
    priority: number = 0
  ): this {
    const events = this._events || (this._events = {});
    const handlers = events[type] || (events[type] = []);

    handlers.push({
      callback,
      context,
      ctx: context || this,
      listening,
      priority,
    });

    handlers.sort((a, b) => b.priority - a.priority);

    if (listening) {
      const listeners = this._listeners || (this._listeners = {});
      listeners[listening.id] = listening;
      listening.count++;
    }

    return this;
  }

  /**
   * Reduces the event callbacks into a map of `{event: onceWrapper}`.
   * `offer` unbinds the `onceWrapper` after it has been called.
   */
  private createOnceHandler(
    callback: EventCallback,
    offCallback: (callback: EventCallback) => void
  ): EventCallback {
    const that = this;
    const onceCallback = <EventCallback>once(function() {
      offCallback(onceCallback);
      callback.apply(that, arguments);
    });

    onceCallback._callback = callback;
    return onceCallback;
  }

  /**
   * Return the id of this event emitter.
   */
  private getListenId(): string {
    return this._listenId || (this._listenId = uniqueId('l'));
  }
}
