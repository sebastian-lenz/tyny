import { Animation } from '../index';
import { PropertyMap } from './propertyMap';
import { Timeline, TimelineOptions } from '../timelines/Timeline';
export interface TimelineAnimationOptions {
    rejectOnStop?: boolean;
}
export declare function timelineAnimation<TProperty, TOptions extends TimelineAnimationOptions, TTimeline extends Timeline>(context: any, properties: PropertyMap<TProperty>, options: TOptions, timelineClass: {
    new (options: TimelineOptions & TOptions & TProperty): TTimeline;
}): Animation<any>;
export declare function timelineAnimation<TProperty, TOptions extends TimelineAnimationOptions, TTimeline extends Timeline, TExtraProps extends {}>(context: any, properties: PropertyMap<TProperty>, options: TOptions, timelineClass: {
    new (options: TimelineOptions & TOptions & TProperty): TTimeline;
}, extraProps: (timelines: TTimeline[]) => TExtraProps): Animation<any> & TExtraProps;
