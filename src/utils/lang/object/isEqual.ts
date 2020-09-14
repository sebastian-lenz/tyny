import { each } from './each';
import { isObject } from './isObject';
import { isArray } from '../array/isArray';

export function isEqual(value: any, other: any): boolean {
  if (isObject(value) && isObject(other)) {
    return (
      Object.keys(value).length === Object.keys(other).length &&
      each(value, (val, key) => val === other[key])
    );
  }

  return value === other;
}
