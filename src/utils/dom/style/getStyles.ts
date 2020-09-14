import { toElement } from '../misc/toElement';

export function getStyles(
  target: tyny.ElementLike,
  pseudoElt?: string | null
): CSSStyleDeclaration | null {
  const element = toElement(target);
  const view = element?.ownerDocument?.defaultView;

  return element && view ? view.getComputedStyle(element, pseudoElt) : null;
}
