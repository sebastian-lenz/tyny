import type { View } from '../View';
export declare type EventHandlerTarget = EventTarget | EventTarget[] | null | undefined;
export interface EventHandlerOptions<T extends View = View> {
    capture?: boolean;
    filter?: {
        (view: T): boolean;
    };
    name: string;
    passive?: boolean;
    selector?: string | {
        (view: T): string;
    };
    self?: boolean;
    target?: EventHandlerTarget | string | {
        (view: View): EventHandlerTarget;
    };
}
export interface EventHandler<T extends View = View> extends EventHandlerOptions<T> {
    handler: string;
}
export declare function event<T extends View = View>(options: EventHandlerOptions<T>): MethodDecorator;
