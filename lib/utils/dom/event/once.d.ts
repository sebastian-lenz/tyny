import { OnOptions } from './on';
import type { EventTargetLike } from './toEventTargets';
export interface OnceOptions extends OnOptions {
    condition?: Function;
    selector?: string;
}
export declare function once(target: EventTargetLike | EventTargetLike[], type: string, listener: Function, { condition, ...options }?: OnceOptions): Function;
