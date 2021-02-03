import { EasingFunction } from '../index';
import { ValueType } from '../timelines/valueTypes/index';
export interface TweenValueOptions<TValue> {
    delay: number;
    duration: number;
    easing: EasingFunction;
    initialValue: TValue;
    targetValue: TValue;
    valueType: ValueType<TValue>;
}
export declare class TweenValue<TValue> {
    protected baseValues: number[];
    protected currentValue: TValue;
    protected delay: number;
    protected duration: number;
    protected easing: EasingFunction;
    protected initialValue: TValue;
    protected targetValue: TValue;
    protected time: number;
    protected valueChanges: number[];
    protected valueType: ValueType<TValue>;
    constructor(options: TweenValueOptions<TValue>);
    getCurrentValue(): TValue;
    update(delta: number): boolean;
}
