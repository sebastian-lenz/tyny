export type EventHandlerTarget = EventTarget | EventTarget[] | null | undefined;

export interface EventHandlerOptions {
  capture?: boolean;
  filter?: { (): boolean };
  name: string;
  passive?: boolean;
  selector?: string | { (): string };
  self?: boolean;
  target?: EventHandlerTarget | { (): EventHandlerTarget };
}

export interface EventHandler extends EventHandlerOptions {
  handler: string;
}

export function event(options: EventHandlerOptions): MethodDecorator {
  return function (target: any, handler: any) {
    const events: tyny.Map<EventHandler> = target.hasOwnProperty('_events')
      ? target._events
      : (target._events = { ...target._events });

    events[handler] = {
      ...options,
      handler,
    };
  };
}
