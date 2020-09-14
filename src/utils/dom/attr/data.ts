import { attr } from './attr';
import { hasAttr } from './hasAttr';

export function data(
  element: tyny.ElementLike,
  attribute: string
): string | null {
  return hasAttr(element, attribute)
    ? attr(element, attribute)
    : attr(element, `data-${attribute}`);
}
