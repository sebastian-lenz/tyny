import { IntervalType } from 'tyny-utils/lib/types/Interval';
import { Delegate, DelegateOptions } from 'tyny-events';
import { viewport } from 'tyny-services/lib/viewport';

import { CreateElementOptions } from './utils/createElement';
import { Initializer, InitializerMap } from './initializers';
import Args from './Args';
import PointerList from './pointers/PointerList';

import components, { ComponentNode } from './components';
import ensureElement from './utils/ensureElement';

export interface ViewClass<TView extends View = View> {
  new (options: any): TView;
}

export type MaybeView = View | undefined;

/**
 * View constructor options
 */
export interface ViewOptions extends CreateElementOptions {
  [name: string]: any;
  componentNode?: ComponentNode;
  element?: HTMLElement;
  owner?: View;
  template?: string | Function;
}

export interface CreateChildOptions<T extends View> {
  options?: any;
  selector: string;
  viewClass: ViewClass<T>;
}

/**
 * Base class of all views.
 */
export default class View extends Delegate {
  /**
   * The underlying DOM element of this view.
   */
  // prettier-ignore
  readonly element!: HTMLElement;

  /**
   * The component registry node linked to this view.
   * @private
   */
  private _componentNode: ComponentNode | undefined;

  /**
   * A map of all initializers that should be invoked by the constructor.
   * @private
   */
  private _initializers: InitializerMap | undefined;

  /**
   * The pointer list attached to this view.
   * @private
   */
  private _pointerList: PointerList | undefined;

  /**
   * The default class name prefix used by predefined components.
   */
  static classNamePrefix: string = 'tyny';

  /**
   * View constructor.
   */
  constructor(options: ViewOptions = {}) {
    super(ensureElement(options).element);

    const { element, _initializers } = this;
    const {
      appendTo,
      componentNode = components.createNode(element),
      template,
    } = options;

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

    this._componentNode = componentNode;
    componentNode.setView(this);

    if (_initializers) {
      for (const key in _initializers) {
        _initializers[key](this, options);
      }
    }
  }

  /**
   * Add a css class to the underlying dom element.
   */
  addClass(...tokens: string[]): this {
    this.element.classList.add(...tokens);
    return this;
  }

  /**
   * Dispose this view.
   *
   * Do not overwrite this method, use the `View.handleDispose` callback instead.
   */
  dispose() {
    const { element, _componentNode, _pointerList } = this;

    if (_componentNode) {
      this._componentNode = undefined;
      _componentNode.dispose();
    } else {
      this.handleDispose();
      super.dispose();

      if (_pointerList) {
        _pointerList.dispose();
        this._pointerList = undefined;
      }

      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  }

  query<T extends HTMLElement = HTMLElement>(selectors: string): T {
    return <T>this.element.querySelector(selectors);
  }

  queryAll<T extends HTMLElement = HTMLElement>(selectors: string): T[] {
    return Array.prototype.slice.call(this.element.querySelectorAll(selectors));
  }

  protected createArgs(options: ViewOptions = {}) {
    const args = new Args(options, this.element);
    args.view = this;
    return args;
  }

  protected createChild<T extends View>({
    options = {},
    selector,
    viewClass,
  }: CreateChildOptions<T>): T {
    return new viewClass({
      element: this.query(selector),
      owner: this,
      ...options,
    });
  }

  protected createOptionalChild<T extends View>({
    options = {},
    selector,
    viewClass,
  }: CreateChildOptions<T>): T | null {
    const element = this.query(selector);
    if (!element) return null;

    return new viewClass({
      element,
      owner: this,
      ...options,
    });
  }

  protected createChildren<T extends View>({
    options = {},
    selector,
    viewClass,
  }: CreateChildOptions<T>): T[] {
    return this.queryAll(selector).map(
      element => new viewClass({ element, owner: this, ...options })
    );
  }

  /**
   * Return the component node of this View.
   */
  getComponentNode(): ComponentNode {
    let { _componentNode } = this;
    if (!_componentNode) {
      _componentNode = components.createNode(this.element);
      _componentNode.setView(this);
      this._componentNode = _componentNode;
    }

    return _componentNode;
  }

  getVisibilityBounds(): IntervalType {
    const { element } = this;
    const bounds = element.getBoundingClientRect();
    const min = bounds.top + viewport().scrollTop;
    const max = min + (bounds.height || element.offsetHeight);
    return { min, max };
  }

  /**
   * Test whether the dom element has the given css class.
   */
  hasClass(token: string): boolean {
    return this.element.classList.contains(token);
  }

  /**
   * Remove a css class from the underlying dom element.
   */
  removeClass(...tokens: string[]): this {
    this.element.classList.remove(...tokens);
    return this;
  }

  /**
   * Toggle a css class on the underlying dom element.
   */
  toggleClass(token: string, force?: boolean): boolean {
    return this.element.classList.toggle(token, force);
  }

  protected handleDispose() {}
}
