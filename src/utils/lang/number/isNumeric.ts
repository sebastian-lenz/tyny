import { isNumber } from './isNumber';
import { isString } from '../string/isString';

export function isNumeric(value: any): boolean {
  return (
    isNumber(value) ||
    (isString(value) && !isNaN(<any>value - parseFloat(value)))
  );
}
