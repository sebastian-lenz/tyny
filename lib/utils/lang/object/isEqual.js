import { each } from './each';
import { isObject } from './isObject';
export function isEqual(value, other) {
    if (isObject(value) && isObject(other)) {
        return (Object.keys(value).length === Object.keys(other).length &&
            each(value, function (val, key) { return val === other[key]; }));
    }
    return value === other;
}
