import { isNumber } from './isNumber';
import { isString } from '../string/isString';
export function isNumeric(value) {
    return (isNumber(value) ||
        (isString(value) && !isNaN(value - parseFloat(value))));
}
