import { isObject } from '../../lang/object/isObject';
export function isNode(value) {
    return isObject(value) && value.nodeType >= 1;
}
