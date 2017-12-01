import { ValueTypeSource } from '../timelines/valueTypes/index';
import { PropertyMap } from './propertyMap';

export interface MomentumValues {
  initialValue?: ValueTypeSource;
  initialVelocity: ValueTypeSource;
  maxValue?: ValueTypeSource;
  minValue?: ValueTypeSource;
}

export interface FromVelocityValues {
  /**
   * The current position on this axis.
   */
  from?: ValueTypeSource;

  /**
   * The maximum allowed position on this axis.
   */
  max?: ValueTypeSource;

  /**
   * The minimum allowed position on this axis.
   */
  min?: ValueTypeSource;

  /**
   * The current velocity on this axis.
   */
  velocity: ValueTypeSource;
}

export type FromVelocityValuesMap = PropertyMap<
  ValueTypeSource | FromVelocityValues
>;

export type MomentumValuesMap = PropertyMap<MomentumValues>;

function isFromVelocityValues(value: any): value is FromVelocityValues {
  return typeof value === 'object' && 'velocity' in value;
}

export default function toMomentumValues(
  map: FromVelocityValuesMap
): MomentumValuesMap {
  return Object.keys(map).reduce(
    (result, key) => {
      const value = map[key];
      if (isFromVelocityValues(value)) {
        result[key] = {
          initialValue: value.from,
          initialVelocity: value.velocity,
          maxValue: value.max,
          minValue: value.min,
        };
      } else {
        result[key] = {
          initialVelocity: value,
        };
      }
      return result;
    },
    {} as MomentumValuesMap
  );
}
