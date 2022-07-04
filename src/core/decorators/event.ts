import type { View } from '../View';

export type EventHandlerTarget = EventTarget | EventTarget[] | null | undefined;

export interface EventHandlerOptions<T extends View = View> {
  capture?: boolean;
  filter?: { (view: T): boolean };
  name: string;
  passive?: boolean;
  selector?: string | { (view: T): string };
  self?: boolean;
  target?: EventHandlerTarget | { (view: View): EventHandlerTarget };
}

export interface EventHandler<T extends View = View>
  extends EventHandlerOptions<T> {
  handler: string;
}

export function event<T extends View = View>(
  options: EventHandlerOptions<T>
): MethodDecorator {
  return function (target: any, handler: any) {
    const events: tyny.Map<EventHandler<T>> = target.hasOwnProperty('_events')
      ? target._events
      : (target._events = { ...target._events });

    events[handler] = {
      ...options,
      handler,
    };
  };
}
