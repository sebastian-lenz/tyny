import { isObject } from '../../lang/object/isObject';
export function isElement(value) {
    return isObject(value) && value.nodeType === 1;
}
