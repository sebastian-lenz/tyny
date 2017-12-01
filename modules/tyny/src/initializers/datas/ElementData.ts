import { isHtmlElement } from 'tyny-utils';

import Data, { DataOptions } from '../Data';
import View, { ViewOptions } from '../../View';

export interface ElementDataOptions extends DataOptions<HTMLElement> {
  type: 'element';

  // The class name of the element that should be created.
  className?: string;

  // The tag name of the element that should be created.
  tagName?: string;
}

export default class ElementData extends Data<
  HTMLElement | null,
  ElementDataOptions
> {
  // The class name of the element that should be created.
  className: string;

  // The tag name of the element that should be created.
  tagName: string;

  /**
   * Extract the value from the given view and options object.
   */
  getValue(scope: View, options: ViewOptions): HTMLElement | null {
    const value = super.getValue(scope, options);
    if (isHtmlElement(value)) return value;

    if (typeof value === 'string') {
      const element = scope.element.querySelector(value);
      if (element) {
        return <HTMLElement>element;
      }
    }

    const { className, tagName } = this;
    if (tagName) {
      const element = document.createElement(tagName);
      if (className) {
        element.className = className;
      }

      scope.element.appendChild(element);
      return element;
    }

    return null;
  }
}
