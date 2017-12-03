import components, { ComponentNode } from '../components';

import { Initializer } from './index';
import View, { ViewClass, ViewOptions } from '../View';

export type ViewFactory = (
  owner: any,
  ownerOptions: any,
  element?: HTMLElement
) => View;

/**
 * ChildInitializer constructor options.
 */
export type InitChildOptions = {
  /**
   * Auto create the component if the selector is missing?
   */
  autoCreate?: boolean;

  /**
   * Factory function that should manage view creation.
   */
  factory?: ViewFactory;

  /**
   * Whether multiple children should be resolved or not.
   */
  multiple?: boolean;

  /**
   * Default constructor options.
   */
  options?: any;

  /**
   * The selector that will be used to retrieve the child elements.
   */
  selector?: string;
  /**
   * The view class that should be instantiated.
   */
  viewClass?: ViewClass;
} & ({ factory: ViewFactory } | { viewClass: ViewClass });

export default function initChild(
  propertyName: string,
  options: InitChildOptions
): Initializer {
  return function(view: View, viewOptions: ViewOptions) {
    const {
      autoCreate,
      factory,
      multiple,
      options: defaultOptions = {},
      selector,
      viewClass,
    } = options;

    const { element } = view;
    let result: any = null;

    function createChild(element?: HTMLElement): View | null {
      const childOptions: ViewOptions = {
        ...defaultOptions,
        owner: view,
      };

      if (element) {
        childOptions.element = element;
      } else {
        childOptions.appendTo = view.element;
      }

      let child;
      if (factory) {
        child = factory(view, viewOptions, element);
      } else if (viewClass) {
        child = new viewClass(childOptions);
      }

      return child || null;
    }

    if (multiple) {
      const elements = selector ? element.querySelectorAll(selector) : [];
      result = [];
      for (let index = 0; index < elements.length; index++) {
        const child = createChild(<HTMLElement>elements[index]);
        if (child) {
          result.push(child);
        }
      }
    } else {
      const child = selector ? element.querySelector(selector) : null;
      if (child || autoCreate) {
        result = createChild(<any>child);
      }
    }

    (<any>view)[propertyName] = result;
  };
}
