import { hasOwn } from './hasOwn';
import { isObject } from './isObject';
export function get(obj, key, fallback = null, type = null) {
    if (!isObject(obj) || !hasOwn(obj, key)) {
        return fallback;
    }
    const value = obj[key];
    if (type === null && fallback !== null)
        type = typeof fallback;
    return type == null || type === typeof value ? value : fallback;
}
