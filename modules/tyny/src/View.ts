import { IntervalType } from 'tyny-utils';
import { Delegate, DelegateOptions } from 'tyny-events';
import { viewport } from 'tyny-services';

import { Initializer } from './initializers';
import ComponentsNode from './services/components/ComponentsNode';
import components from './services/components';

export interface ViewClass {
  new (options: ViewOptions): View;
}

export interface ViewOptions {
  appendTo?: HTMLElement;
  attributes?: any;
  className?: string;
  element?: HTMLElement;
  node?: ComponentsNode;
  owner?: View;
  tagName?: string;
  template?: string | Function;
}

export interface SafeViewOptions extends ViewOptions {
  element: HTMLElement;
}

export type MaybeView = View | undefined;

export default class View<
  TOptions extends ViewOptions = ViewOptions
> extends Delegate {
  element: HTMLElement;
  node: ComponentsNode | undefined;
  private _initializers: { [name: string]: Initializer } | undefined;
  static classNamePrefix: string = 'tyny';

  constructor(options: TOptions) {
    super(View.ensureElement(options).element);
    const { element, _initializers } = this;

    if (_initializers) {
      for (const key in _initializers) {
        _initializers[key].invoke(this, options);
      }
    }

    const { appendTo, template } = options;
    if (template) {
      if (typeof template === 'function') {
        element.innerHTML = template(this, options);
      } else {
        element.innerHTML = template;
      }
    }

    if (appendTo) {
      appendTo.appendChild(element);
    }

    const node = options.node || components.root.createDescendant(element);
    this.node = node;
    node.setView(this);
    node.setResizeHandler(() => this.handleResize());

    this.initialize(options);
  }

  addClass(...tokens: string[]): this {
    this.element.classList.add(...tokens);
    return this;
  }

  dispose() {
    const { element, node } = this;
    if (node) {
      this.node = undefined;
      node.dispose();
    } else {
      this.handleDispose();
      super.dispose();
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }

  getVisibilityBounds(): IntervalType {
    const { element } = this;
    const bounds = element.getBoundingClientRect();
    const min = bounds.top + viewport.scrollTop;
    const max = min + (bounds.height || element.offsetHeight);
    return { min, max };
  }

  hasClass(token: string): boolean {
    return this.element.classList.contains(token);
  }

  removeClass(...tokens: string[]): this {
    this.element.classList.remove(...tokens);
    return this;
  }

  toggleClass(token: string, force?: boolean): boolean {
    return this.element.classList.toggle(token, force);
  }

  protected initialize(options: TOptions) {}

  protected handleDispose() {}

  protected handleResize() {}

  static ensureElement(options: ViewOptions): SafeViewOptions {
    if (!options.element) {
      const { appendTo, attributes, className, tagName = 'div' } = options;
      const element = document.createElement(tagName);
      options.element = element;

      if (appendTo) appendTo.appendChild(element);
      if (className) element.className = className;
      if (attributes) {
        Object.keys(attributes).forEach(key => {
          element.setAttribute(key, attributes[key]);
        });
      }
    }

    return options as SafeViewOptions;
  }
}
