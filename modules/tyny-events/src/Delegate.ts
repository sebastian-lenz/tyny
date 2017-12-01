import EventEmitter from './EventEmitter';

export interface DelegateMap {
  [event: string]: EventListener;
}

export interface DelegateOptions {
  passive?: boolean;
  selector?: string;
  scope?: any;
}

export interface DelegateListener {
  element: Element | Document | Window;
  eventName: string;
  handler: EventListener;
  listener: EventListener;
  scope: any;
  selector: string | undefined;
}

const supportsPassiveOption = (function() {
  let result = false;
  try {
    const listener = () => null;
    const opts = Object.defineProperty({}, 'passive', {
      get: () => (result = true),
    });

    window.addEventListener('test', listener, opts);
    window.removeEventListener('test', listener, opts);
  } catch (e) {}

  return result;
})();

/**
 * Base class of all views.
 */
export default class Delegate extends EventEmitter {
  /**
   * The underlying element of this delegate.
   */
  element: Element | Document | Window | undefined;

  /**
   * A list of all delegated dom events.
   */
  private listeners: DelegateListener[] = [];

  /**
   * Delegate constructor.
   */
  constructor(element?: Element | Document | Window) {
    super();
    this.element = element;
  }

  dispose() {
    super.dispose();
    this.undelegateAll();
  }

  /**
   * Make a event delegation handler for the given `eventName` and `selector`
   * and attach it to `this.el`.
   * If selector is empty, the listener will be bound to `this.el`. If not, a
   * new handler that will recursively traverse up the event target's DOM
   * hierarchy looking for a node that matches the selector. If one is found,
   * the event's `delegateTarget` property is set to it and the return the
   * result of calling bound `listener` with the parameters given to the
   * handler.
   */
  delegate(
    eventName: string,
    listener: EventListener,
    options: DelegateOptions = {}
  ): EventListener {
    const { selector, scope = this } = options;
    const { element } = this;
    let handler: EventListener;

    if (!element) {
      throw Error('The element of this delegate is not set.');
    }

    if (selector) {
      handler = function(event: any) {
        let node = <HTMLElement>(event.target || event.srcElement);
        for (; node && node != element; node = <HTMLElement>node.parentNode) {
          if (!node.matches(selector)) continue;
          event.delegateTarget = node;
          listener.call(scope, event);
          break;
        }
      };
    } else {
      handler = function(event: any) {
        listener.call(scope, event);
      };
    }

    if (options.passive === false && supportsPassiveOption) {
      element.addEventListener(eventName, handler, <any>{ passive: false });
    } else {
      element.addEventListener(eventName, handler, false);
    }

    this.listeners.push({
      element,
      eventName,
      handler,
      listener,
      scope,
      selector,
    });

    return handler;
  }

  delegateEvents(events: DelegateMap, options?: DelegateOptions) {
    Object.keys(events).forEach(key => {
      this.delegate(key, events[key]);
    });
  }

  /**
   * Remove a single delegated event. Either `eventName` or `selector` must
   * be included, `selector` and `listener` are optional.
   */
  undelegate(
    eventName: string,
    listener?: EventListener,
    options: DelegateOptions = {}
  ): this {
    const { listeners } = this;
    const { selector, scope } = options;
    const handlers = listeners.slice();
    let i = handlers.length;

    while (i--) {
      const item = handlers[i];
      const match =
        item.eventName === eventName &&
        (listener ? item.listener === listener : true) &&
        (scope ? item.scope === scope : true) &&
        (selector ? item.selector === selector : true);

      if (match) {
        item.element.removeEventListener(item.eventName, item.handler, false);
        listeners.splice(i, 1);
      }
    }

    return this;
  }

  /**
   * Remove all events created with `delegate`.
   */
  undelegateAll(): this {
    const { listeners } = this;
    for (let i = 0, len = listeners.length; i < len; i++) {
      const { element, eventName, handler } = listeners[i];
      element.removeEventListener(eventName, handler, false);
    }

    this.listeners.length = 0;
    return this;
  }

  undelegateEvents(events: DelegateMap, options?: DelegateOptions) {
    Object.keys(events).forEach(key => {
      this.undelegate(key, events[key], options);
    });
  }
}
