import { isObject } from '../../lang/object/isObject';
export function isWindow(value) {
    return isObject(value) && value === value.window;
}
