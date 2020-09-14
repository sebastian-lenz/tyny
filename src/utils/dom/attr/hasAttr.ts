import { toElements } from '../misc/toElements';

export function hasAttr(element: tyny.ElementLike, name: string): boolean {
  return toElements(element).some((element) => element.hasAttribute(name));
}
