import { toElement } from '../misc';

export function parent(value: tyny.ElementLike): Element | null {
  const element = toElement(value);
  return element ? element.parentElement : null;
}
