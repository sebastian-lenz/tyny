import { isObject } from '../../lang/object/isObject';

export function isWindow(value: any): value is Window {
  return isObject(value) && value === value.window;
}
