import { TweenOptions } from '../tween';
import { Timeline, TimelineOptions } from './Timeline';
import { TweenValue } from './TweenValue';
export interface TweenTimelineOptions<TValue> extends TimelineOptions<TValue>, TweenOptions {
    targetValue: TValue;
}
export declare class TweenTimeline<TValue = any> extends Timeline<TValue> {
    protected baseValue: TValue;
    protected tweenValues: TweenValue<TValue>[];
    protected targetValue: TValue;
    constructor(options: TweenTimelineOptions<TValue>);
    advance(to: TValue, options: TweenOptions): boolean;
    update(timeStep: number): boolean;
}
