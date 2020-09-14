import { isObject } from '../../lang/object/isObject';

export function isNode(value: any): value is Node {
  return isObject(value) && value.nodeType >= 1;
}
