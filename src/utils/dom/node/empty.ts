import { $ } from './$';

export function empty(value: tyny.ElementQuery): Element | null {
  const element = $(value);
  if (!element) {
    return null;
  }

  element.innerHTML = '';
  return element;
}
