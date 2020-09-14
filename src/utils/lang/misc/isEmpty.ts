import { isArray } from '../array/isArray';
import { isObject } from '../object/isObject';

export function isEmpty(obj: any): boolean {
  if (isArray(obj)) {
    return !obj.length;
  } else if (isObject(obj)) {
    return !Object.keys(obj).length;
  }

  return false;
}
