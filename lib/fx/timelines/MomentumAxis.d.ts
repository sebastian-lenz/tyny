import { EasingFunction } from '../index';
export interface MomentumValueOptions {
    bounceDuration: number;
    bounceEasing: EasingFunction;
    deceleration: number;
    epsilon: number;
    friction: number;
    initialValue: number;
    initialVelocity: number;
    maxValue: number | undefined;
    minValue: number | undefined;
}
export interface MomentumValue {
    currentValue(): number;
    update(delta: number): boolean;
}
/**
 * Calculates the momentum of a single axis.
 */
export declare class MomentumAxis {
    protected bounceDelta: number;
    protected bounceDuration: number;
    protected bounceEasing: EasingFunction;
    protected bounceInitial: number | undefined;
    protected bounceStep: number;
    protected bounceTarget: number;
    protected currentValue: number;
    protected deceleration: number;
    protected epsilon: number;
    protected friction: number;
    protected maxValue: number | undefined;
    protected minValue: number | undefined;
    protected velocity: number;
    constructor(options: MomentumValueOptions);
    getCurrentValue(): number;
    update(timeStep: number): boolean;
}
