import { AbstractAdapter } from './adapters/AbstractAdapter';
import { Velocity } from './Velocity';
export declare type PointerType = 'mouse' | 'touch' | 'pen';
export interface PointerOptions {
    adapter: AbstractAdapter;
    clientX: number;
    clientY: number;
    id: string;
    type: PointerType;
}
export interface PointerMoveOptions {
    clientX: number;
    clientY: number;
}
export interface PointerVelocity {
    [name: string]: number;
    clientX: number;
    clientY: number;
}
export declare class Pointer {
    clientX: number;
    clientY: number;
    initialClientX: number;
    initialClientY: number;
    initialTransformClientX: number;
    initialTransformClientY: number;
    lastClientX: number;
    lastClientY: number;
    velocity: Velocity<PointerVelocity>;
    readonly adapter: AbstractAdapter;
    readonly id: string;
    readonly type: PointerType;
    get delta(): tyny.Point;
    get deltaLength(): number;
    constructor(options: PointerOptions);
    move({ clientX, clientY }: PointerMoveOptions): void;
    resetInitialPosition(): void;
}
