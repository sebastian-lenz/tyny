import { hasOwn } from './hasOwn';
import { isObject } from './isObject';
export function get(obj, key, fallback = null) {
    if (!isObject(obj) || !hasOwn(obj, key)) {
        return fallback;
    }
    const value = obj[key];
    return typeof fallback === typeof value ? value : fallback;
}
