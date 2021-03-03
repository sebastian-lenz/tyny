import { matches } from './matches';
import { toElement } from '../misc/toElement';

export function parents(
  element: tyny.ElementLike,
  selector?: string,
  self?: boolean
): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let parent = toElement(element);
  if (!self && parent) {
    parent = parent.parentElement;
  }

  while (parent) {
    if (!selector || matches(parent, selector)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  return parents;
}

export function parentsAndSelf(element: tyny.ElementLike, selector?: string) {
  return parents(element, selector, true);
}
