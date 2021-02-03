import { SpringOptions } from '../spring';
import { Timeline, TimelineOptions } from './Timeline';
export interface SpringTimelineOptions<TValue> extends TimelineOptions<TValue>, SpringOptions {
    targetValue: TValue;
}
export declare class SpringTimeline<TValue = any> extends Timeline<TValue> {
    protected acceleration: number;
    protected epsilon: number;
    protected friction: number;
    protected targetValue: TValue;
    protected velocity: TValue;
    constructor(options: SpringTimelineOptions<TValue>);
    advance(to: TValue): boolean;
    update(timeStep: number): boolean;
}
