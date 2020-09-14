import { toElement, toElements } from '../misc';
import { isFunction } from '../../lang/function/isFunction';
import { isString } from '../../lang/string/isString';
import { isUndefined } from '../../lang/misc/isUndefined';
import { removeAttr } from './removeAttr';

export type AttrMap = { [name: string]: AttrValue };
export type AttrValue = AttrPrimitive | AttrCallback;
export type AttrPrimitive = string | number | null;
export type AttrCallback = {
  (value: string | null, element: Element): AttrPrimitive;
};

export function attr(target: tyny.ElementLike, name: AttrMap): void;

export function attr(target: tyny.ElementLike, name: string): string | null;

export function attr(
  target: tyny.ElementLike,
  name: string,
  value: AttrValue
): void;

export function attr(
  target: tyny.ElementLike,
  param: AttrMap | string,
  value?: AttrValue
): string | null | void {
  if (!isString(param)) {
    return Object.keys(param).forEach((name) =>
      attr(target, name, param[name])
    );
  }

  if (isUndefined(value)) {
    const element = toElement(target);
    return element ? element.getAttribute(param) : null;
  }

  for (const element of toElements(target)) {
    if (isFunction(value)) {
      attr(target, param, value(attr(element, param), element));
    } else if (value === null) {
      removeAttr(element, param);
    } else {
      element.setAttribute(param, value.toString());
    }
  }
}
