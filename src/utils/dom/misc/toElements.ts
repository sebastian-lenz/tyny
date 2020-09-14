import { isElement } from './isElement';
import { isNodeCollection } from './isNodeCollection';
import { notNullified } from '../../lang/misc/notNullified';
import { toElement } from './toElement';

export function toElements(element: tyny.ElementLike): Array<HTMLElement> {
  if (isElement(element)) {
    return [element];
  }

  if (isNodeCollection(element)) {
    element = Array.prototype.slice.call(element);
  }

  return Array.isArray(element)
    ? element.map(toElement).filter(notNullified)
    : [];
}
