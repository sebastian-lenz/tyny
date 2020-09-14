import { isObject } from '../../lang/object/isObject';

export function isElement(value: any): value is HTMLElement {
  return isObject(value) && value.nodeType === 1;
}
