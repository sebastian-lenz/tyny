import { MomentumAxis } from './MomentumAxis';
import { MomentumOptions } from '../momentum';
import { Timeline, TimelineOptions } from './Timeline';
export interface MomentumTimelineOptions<TValue> extends TimelineOptions<TValue>, MomentumOptions {
    initialVelocity: TValue;
    maxValue?: TValue;
    minValue?: TValue;
}
export declare class MomentumTimeline<TValue> extends Timeline<TValue> {
    protected axes: MomentumAxis[];
    constructor(options: MomentumTimelineOptions<TValue>);
    update(timeStep: number): boolean;
}
