import EventEmitter from './EventEmitter';
import hasPassiveEvents from './utils/hasPassiveEvents';

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

export type DelegatedEvent<T extends Event = Event> = T & {
  delegateTarget: HTMLElement;
};

/**
 * Base class of all views.
 */
export default class Delegate extends EventEmitter {
  /**
   * The underlying element of this delegate.
   */
  readonly element: Element | Document | Window;

  /**
   * A list of all delegated dom events.
   */
  private _delegates: DelegateListener[] = [];

  /**
   * Delegate constructor.
   */
  constructor(element: Element | Document | Window) {
    super();
    this.element = element;
  }

  /**
   * Disposes this instance.
   */
  dispose() {
    super.dispose();
    this.undelegateAll();
  }

  /**
   * Make a event delegation handler for the given `eventName` and `selector`
   * and attach it to `this.el`.
   *
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

    if (options.passive === false && hasPassiveEvents()) {
      element.addEventListener(eventName, handler, <any>{ passive: false });
    } else {
      element.addEventListener(eventName, handler, false);
    }

    this._delegates.push({
      element,
      eventName,
      handler,
      listener,
      scope,
      selector,
    });

    return handler;
  }

  /**
   * Delegate a map of events.
   */
  delegateEvents(events: DelegateMap, options?: DelegateOptions) {
    Object.keys(events).forEach(key => {
      this.delegate(key, events[key], options);
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
    const { _delegates } = this;
    const { selector, scope } = options;
    const handlers = _delegates.slice();
    let index = handlers.length;

    while (index--) {
      const handler = handlers[index];
      const match =
        handler.eventName === eventName &&
        (listener ? handler.listener === listener : true) &&
        (scope ? handler.scope === scope : true) &&
        (selector ? handler.selector === selector : true);

      if (match) {
        _delegates.splice(index, 1);
        handler.element.removeEventListener(
          handler.eventName,
          handler.handler,
          false
        );
      }
    }

    return this;
  }

  /**
   * Remove all events created with `delegate`.
   */
  undelegateAll(): this {
    const { _delegates } = this;
    for (let i = 0, len = _delegates.length; i < len; i++) {
      const { element, eventName, handler } = _delegates[i];
      element.removeEventListener(eventName, handler, false);
    }

    this._delegates.length = 0;
    return this;
  }

  /**
   * Undelegate a map of events.
   */
  undelegateEvents(events: DelegateMap, options?: DelegateOptions) {
    Object.keys(events).forEach(key => {
      this.undelegate(key, events[key], options);
    });
  }
}
