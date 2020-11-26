import { isElement, toElements } from '../misc';
import { matches } from './matches';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { startsWith } from '../../lang/string/startsWith';

const elProto: any = Element ? Element.prototype : {};

const closestFn =
  elProto.closest ||
  function (this: Element, selector: string) {
    let ancestor: Element | null = this;

    do {
      if (matches(ancestor, selector)) {
        return ancestor;
      }
    } while ((ancestor = parent(ancestor)));
  };

export function closest(
  element: Element | undefined | null,
  selector: string
): Element | null;

export function closest(element: tyny.ElementLike, selector: string): Element[];

export function closest(
  element: tyny.ElementLike,
  selector: string
): Element | Array<Element> | null {
  if (startsWith(selector, '>')) {
    selector = selector.slice(1);
  }

  if (!element) {
    return null;
  }

  return isElement(element)
    ? closestFn.call(element, selector)
    : toElements(element)
        .map((element) => closest(element, selector))
        .filter(notNullified);
}
