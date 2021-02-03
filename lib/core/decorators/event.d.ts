export declare type EventHandlerTarget = EventTarget | EventTarget[] | null | undefined;
export interface EventHandlerOptions {
    capture?: boolean;
    filter?: {
        (): boolean;
    };
    name: string;
    passive?: boolean;
    selector?: string | {
        (): string;
    };
    self?: boolean;
    target?: EventHandlerTarget | {
        (): EventHandlerTarget;
    };
}
export interface EventHandler extends EventHandlerOptions {
    handler: string;
}
export declare function event(options: EventHandlerOptions): MethodDecorator;
