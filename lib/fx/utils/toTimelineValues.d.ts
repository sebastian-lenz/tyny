import { ValueTypeSource } from '../timelines/valueTypes/index';
import { PropertyMap } from './propertyMap';
export interface TimelineValues {
    initialValue?: ValueTypeSource;
    targetValue: ValueTypeSource;
}
export interface FromToValues {
    from?: ValueTypeSource;
    to: ValueTypeSource;
}
export declare type FromToValuesMap = PropertyMap<ValueTypeSource | FromToValues>;
export declare type TimelineValuesMap = PropertyMap<TimelineValues>;
export declare function toTimelineValues(map: FromToValuesMap): TimelineValuesMap;