import { AnimationPlayState } from '../index';
import { Accessor } from './accessors';
import { ValueType } from './valueTypes';
export interface TimelineOptions<TValue = any> {
    context: any;
    property: string;
    initialValue?: TValue;
}
export declare abstract class Timeline<TValue = any> {
    onFinished: Function | undefined;
    onStopped: Function | undefined;
    readonly accessor: Accessor;
    readonly context: any;
    readonly property: string;
    protected currentValue: TValue;
    protected initialValue: TValue;
    protected playState: AnimationPlayState;
    protected valueType: ValueType<TValue>;
    constructor(options: TimelineOptions<TValue>);
    getCurrentValue(): TValue;
    getPlayState(): AnimationPlayState;
    stop(): void;
    abstract update(timeStep: number): boolean;
    protected handleFinished(): void;
    protected handleStopped(): void;
}
