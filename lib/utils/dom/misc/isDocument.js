import { isObject } from '../../lang/object/isObject';
export function isDocument(value) {
    return isObject(value) && value.nodeType === 9;
}
