import { matches } from './matches';
import { toElement } from '../misc/toElement';

export function parents(
  element: tyny.ElementLike,
  selector?: string
): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let parent = toElement(element);

  while (parent && (parent = parent.parentElement)) {
    if (!selector || matches(parent, selector)) {
      parents.push(parent);
    }
  }

  return parents;
}
