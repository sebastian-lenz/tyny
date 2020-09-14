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

export type FromToValuesMap = PropertyMap<ValueTypeSource | FromToValues>;

export type TimelineValuesMap = PropertyMap<TimelineValues>;

function isFromToValues(value: any): value is FromToValues {
  return typeof value === 'object' && 'to' in value;
}

export function toTimelineValues(map: FromToValuesMap): TimelineValuesMap {
  return Object.keys(map).reduce((result, key) => {
    const value = map[key];
    if (isFromToValues(value)) {
      result[key] = { initialValue: value.from, targetValue: value.to };
    } else {
      result[key] = { targetValue: value };
    }
    return result;
  }, {} as TimelineValuesMap);
}
