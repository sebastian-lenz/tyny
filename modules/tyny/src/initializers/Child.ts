import components, { ComponentsNode } from '../services/components';

import { Initializer } from './index';
import View, { ViewClass, ViewOptions } from '../View';

export type ViewFactory = (
  scope: View,
  options: ViewOptions,
  element?: HTMLElement
) => View;

/**
 * ChildInitializer constructor options.
 */
export interface ChildOptions {
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
  viewClass: ViewClass;
}

/**
 * An initializer that instantiates child components.
 */
export default class Child implements Initializer {
  /**
   * Auto create the component if the selector is missing?
   */
  autoCreate: boolean;

  /**
   * Factory function that should manage view creation.
   */
  factory: ViewFactory | undefined;

  /**
   * Default constructor options.
   */
  options: any;

  /**
   * The name of the property this initializer should initialize.
   */
  propertyName: string;

  /**
   * The selector that will be used to retrieve the child elements.
   */
  selector: string;

  /**
   * Whether multiple children should be resolved or not.
   */
  multiple: boolean;

  /**
   * The view class that should be instantiated.
   */
  viewClass: ViewClass | undefined;

  /**
   * ChildInitializer constructor.
   *
   * @param propertyName
   *   The name of the property this initializer should initialize.
   */
  constructor(propertyName: string) {
    this.propertyName = propertyName;
  }

  /**
   * Invoke this initializer for the given scope.
   *
   * @param scope
   *   The view instance that should be initialized.
   * @param options
   *   The constructor options that have been passed to the view.
   */
  invoke(scope: View, options: ViewOptions) {
    const { autoCreate, multiple, propertyName, selector } = this;
    const { element } = scope;
    let result: any = null;

    if (multiple) {
      const elements = selector ? element.querySelectorAll(selector) : [];
      result = [];
      for (let index = 0; index < elements.length; index++) {
        result.push(
          this.createComponent(scope, options, <HTMLElement>elements[index])
        );
      }
    } else {
      const child = selector ? element.querySelector(selector) : null;
      if (child || autoCreate) {
        result = this.createComponent(scope, options, <any>child);
      }
    }

    (<any>scope)[propertyName] = result;
  }

  /**
   * Create an instance of the child view class for the given element.
   *
   * @param scope
   * @param element
   *   The dom element a view instance should be created for.
   */
  createComponent(
    scope: View,
    options: ViewOptions,
    element?: HTMLElement
  ): View | null {
    const { factory, options: defaultOptions = {}, viewClass } = this;
    const { root } = components;
    const childOptions: ViewOptions = {
      ...defaultOptions,
      owner: scope,
    };

    let node: ComponentsNode | undefined;
    if (element) {
      node = root.getDescendantByElement(element);
      if (node && node.hasView()) return null;
    }

    if (element) {
      childOptions.element = element;
    } else {
      childOptions.appendTo = scope.element;
    }

    let child;
    if (factory) {
      child = factory(scope, options, element);
    } else if (viewClass) {
      child = new viewClass(childOptions);
    }

    if (!child) return null;
    if (!node) node = root.createDescendant(child.element);
    node.setView(child);

    return child;
  }

  /**
   * Apply the given options object on this initializer.
   *
   * @param options
   *   The options that should be applied.
   */
  setOptions(options: ChildOptions) {
    Object.assign(this, options);
  }
}
