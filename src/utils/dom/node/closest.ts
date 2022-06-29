import { isElement, toElements } from '../misc';
import { matches } from './matches';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { startsWith } from '../../lang/string/startsWith';

const elProto: any = typeof Element !== 'undefined' ? Element.prototype : {};

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

export function closest<T extends HTMLElement = HTMLElement>(
  element: Element | EventTarget | undefined | null,
  selector: string
): T | null;

export function closest<T extends HTMLElement = HTMLElement>(
  element: tyny.ElementLike,
  selector: string
): T[];

export function closest<T extends HTMLElement = HTMLElement>(
  element: tyny.ElementLike,
  selector: string
): T | Array<T> | null {
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
