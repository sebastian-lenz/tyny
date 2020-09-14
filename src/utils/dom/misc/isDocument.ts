import { isObject } from '../../lang/object/isObject';

export function isDocument(value: any): value is Document {
  return isObject(value) && value.nodeType === 9;
}
