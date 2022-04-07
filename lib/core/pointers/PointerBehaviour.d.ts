import { Behaviour, BehaviourOptions } from '../Behaviour';
import { Pointer, PointerOptions, PointerMoveOptions } from './Pointer';
import { Transform2D } from '../../utils/types/Transform2D';
import { Velocity } from './Velocity';
import type { AbstractAdapter } from './adapters/AbstractAdapter';
import type { View } from '../View';
export declare type NativeEvent = MouseEvent | PointerEvent | TouchEvent;
export declare type MaybeNativeEvent = NativeEvent | undefined;
export interface PointerBehaviourVelocity {
    [name: string]: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
}
export interface PointerBehaviourOptions extends BehaviourOptions {
    target?: HTMLElement | null;
}
export declare class PointerBehaviour<TView extends View = View> extends Behaviour<TView> {
    readonly initialCenter: tyny.Point;
    readonly initialTransform: Transform2D;
    readonly pointers: Pointer[];
    readonly velocity: Velocity<PointerBehaviourVelocity>;
    adapter: AbstractAdapter | null;
    constructor(view: TView, options?: PointerBehaviourOptions);
    get center(): tyny.Point;
    get hasPointers(): boolean;
    get transform(): Transform2D;
    get usePassiveEvents(): boolean;
    addPointer(event: NativeEvent, options: PointerOptions): void;
    hasPointersOfAdapter(adapter: AbstractAdapter): boolean;
    removePointer(event: NativeEvent | undefined, id: string): void;
    removeAllPointers(): void;
    movePointer(event: NativeEvent, id: string, options: PointerMoveOptions): void;
    /**
     * Prevent all drag events from heppaning inside elements that
     * we control mouse events on. Fixes drag behviour in firefox.
     */
    onNativeDragStart(event: Event): void;
    onAdd(event: NativeEvent, pointer: Pointer): boolean;
    onChanged(event: MaybeNativeEvent, pointer: Pointer): void;
    onMove(event: NativeEvent, pointer: Pointer): boolean;
    onRemove(event: MaybeNativeEvent, pointer: Pointer): void;
    onDestroyed(): void;
    commit(event: NativeEvent | undefined, pointer: Pointer, callback: Function): void;
}
