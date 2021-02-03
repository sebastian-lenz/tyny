import { Animation } from '../index';
import { PropertyMap } from './propertyMap';
import { Timeline, TimelineOptions } from '../timelines/Timeline';
export interface TimelineAnimationOptions {
    rejectOnStop?: boolean;
}
export declare function timelineAnimation<TProperty, TOptions extends TimelineAnimationOptions, TTimeline extends Timeline, TExtraProps>(context: any, properties: PropertyMap<TProperty>, options: TOptions, timelineClass: {
    new (options: TimelineOptions & TOptions & TProperty): TTimeline;
}, extraProps: (timelines: TTimeline[]) => TExtraProps): Animation<any> & TExtraProps;
