import { isArray } from './isArray';
import { isNumeric } from '../number/isNumeric';
import { isString } from '../string/isString';
import { toBoolean } from '../misc/toBoolean';
import { toNumber } from '../number/toNumber';

export function toList(value: any): Array<any> {
  if (isArray(value)) {
    return value;
  } else if (isString(value)) {
    return value
      .split(/,(?![^(]*\))/)
      .map((value) =>
        isNumeric(value) ? toNumber(value) : toBoolean(value.trim())
      );
  }

  return [value];
}
