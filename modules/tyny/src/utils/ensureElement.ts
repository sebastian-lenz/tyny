import { ViewOptions } from '../View';
import createElement from './createElement';

export interface SafeViewOptions extends ViewOptions {
  element: HTMLElement;
}

export default function ensureElement(options: ViewOptions): SafeViewOptions {
  if (!options.element) {
    options.element = createElement(options);
  }

  return options as SafeViewOptions;
}
