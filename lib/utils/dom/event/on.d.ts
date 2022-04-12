import { EventTargetLike } from './toEventTargets';
export interface OnOptions extends AddEventListenerOptions {
    self?: boolean;
    selector?: string;
    scope?: any;
}
declare type VoidCallback = () => void;
export declare function on(target: EventTargetLike | EventTargetLike[], type: string, listener: Function, { selector, self, scope, ...options }?: OnOptions): VoidCallback;
export declare function off(target: EventTargetLike | EventTargetLike[], type: string, listener: Function, options?: EventListenerOptions | boolean): void;
export {};
