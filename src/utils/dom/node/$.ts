import { isString } from '../../lang/string/isString';
import { toElement, toElements } from '../misc';
import { fragment } from './fragment';
import { find, findAll, SelectorContext } from './find';

function isHtml(str: string): boolean {
  return str[0] === '<' || !!str.match(/^\s*</);
}

export function $(
  selector: tyny.ElementQuery,
  ctx?: SelectorContext
): Element | null {
  if (!isString(selector)) {
    return toElement(selector);
  } else if (isHtml(selector)) {
    return toElement(fragment(selector));
  }

  return find(selector, ctx);
}

export function $$(
  selector: tyny.ElementQuery,
  ctx?: SelectorContext
): Element[] {
  if (!isString(selector)) {
    return toElements(selector);
  } else if (isHtml(selector)) {
    return toElements(fragment(selector));
  }

  return findAll(selector, ctx);
}
