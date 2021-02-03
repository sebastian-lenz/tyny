import { isArray } from './isArray';
import { isNumeric } from '../number/isNumeric';
import { isString } from '../string/isString';
import { toBoolean } from '../misc/toBoolean';
import { toNumber } from '../number/toNumber';
export function toList(value) {
    if (isArray(value)) {
        return value;
    }
    else if (isString(value)) {
        return value
            .split(/,(?![^(]*\))/)
            .map(function (value) {
            return isNumeric(value) ? toNumber(value) : toBoolean(value.trim());
        });
    }
    return [value];
}
