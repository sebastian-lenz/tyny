import { viewport } from 'tyny-services';

import { Component } from './Components';
import View, { ViewClass, ViewOptions } from '../../View';

/**
 * Return an array describing the path from the given source element
 * to the given target element.
 *
 * Omits the source element and includes the target element. Returns NULL
 * if the target element is not a child of the source element.
 */
const findPath = (
  from: HTMLElement,
  to: HTMLElement
): HTMLElement[] | undefined => {
  const result = [];
  let parent: HTMLElement | null = to;
  while (parent) {
    if (parent === from) return result;
    result.unshift(parent);
    parent = parent.parentElement;
  }

  return undefined;
};

export default class ComponentsNode {
  private children: ComponentsNode[] | undefined;
  private didResizeChildren: boolean = false;
  private element: HTMLElement;
  private parent: ComponentsNode | null;
  private resizeHandler: Function | undefined;
  private view: View | undefined;
  private viewClass: ViewClass | undefined;

  constructor(element: HTMLElement, parent: ComponentsNode | null = null) {
    this.element = element;
    this.parent = parent;

    if (!parent) {
      viewport.on('resize', () => this.handleResize());
    }
  }

  createChild(element: HTMLElement): ComponentsNode {
    if (element.parentNode !== this.element) {
      throw new Error('Invalid child element given.');
    }

    let node = this.getChildByElement(element);
    if (!node) {
      const children = this.children || (this.children = []);
      node = new ComponentsNode(element, this);
      children.push(node);
    }

    return node;
  }

  createDescendant(childElement: HTMLElement): ComponentsNode {
    const { children, element } = this;
    const path = findPath(element, childElement);
    if (!path) {
      throw new Error('Invalid descendant element given.');
    }

    let node: ComponentsNode = this;
    let pathElement;
    while (node && (pathElement = path.shift())) {
      node = node.createChild(pathElement);
    }

    return node;
  }

  dispose() {
    const { children, parent, view } = this;
    this.children = undefined;
    this.resizeHandler = undefined;
    this.view = undefined;

    if (children) {
      children.forEach(child => child.dispose());
    }

    if (view) {
      view.dispose();
    }

    if (parent) {
      parent.handleChildRemoved(this);
    }
  }

  getChildByElement(element: HTMLElement): ComponentsNode | undefined {
    const { children } = this;
    if (!children) return undefined;
    return children.find(child => child.element === element);
  }

  getDescendantByElement(
    childElement: HTMLElement
  ): ComponentsNode | undefined {
    const { children, element } = this;
    const path = findPath(element, childElement);
    if (!path) return undefined;

    let node: ComponentsNode | undefined = this;
    let pathElement;
    while (node && (pathElement = path.shift())) {
      node = node.getChildByElement(pathElement);
    }

    return node;
  }

  getView(): View | undefined {
    return this.view;
  }

  hasView(): boolean {
    return !!this.view;
  }

  initializeAllViews(): View[] {
    const { children } = this;
    const view = this.initializeView();
    if (view) return [view];

    const result: View[] = [];
    if (children) {
      return children.reduce((memo, child) => {
        return memo.concat(child.initializeAllViews());
      }, result);
    }

    return result;
  }

  initializeComponent(
    component: Component,
    options?: Partial<ViewOptions>
  ): View[] {
    const nodes = this.registerComponent(component);
    return nodes
      .map(node => node.initializeView(options))
      .filter((view): view is View => !!view);
  }

  initializeView(options: Partial<ViewOptions> = {}): View | undefined {
    const { element, view, viewClass } = this;
    if (!view && viewClass) {
      this.view = new viewClass({
        ...options,
        element,
        node: this,
      });
    }

    return this.view;
  }

  registerComponent(component: Component): ComponentsNode[] {
    const { selector, viewClass } = component;
    const { element } = this;
    const targets = element.querySelectorAll(selector);
    const result = [];

    for (let index = 0; index < targets.length; index++) {
      const target = targets[index];
      const node = this.createDescendant(target as HTMLElement);
      node.setViewClass(viewClass);
      result.push(node);
    }

    return result;
  }

  resizeChildren() {
    const { children } = this;
    this.didResizeChildren = true;
    if (children) {
      children.forEach(child => child.handleResize());
    }
  }

  setResizeHandler(resizeHandler?: Function) {
    this.resizeHandler = resizeHandler;
  }

  setView(view: View) {
    if (this.view && this.view !== view) {
      throw new Error('The view instance of this node is already set.');
    }

    this.view = view;
  }

  setViewClass(viewClass: ViewClass) {
    const { view, viewClass: oldViewClass } = this;
    if (oldViewClass === viewClass) return;
    if (oldViewClass && view) {
      throw new Error(
        'Cannot overwrite view class of nodes which already have an instance.'
      );
    }

    this.viewClass = viewClass;
  }

  protected handleResize() {
    const { children, resizeHandler } = this;
    this.didResizeChildren = false;

    if (resizeHandler) {
      resizeHandler();
    }

    if (!this.didResizeChildren) {
      this.resizeChildren();
    }
  }

  protected handleChildRemoved(node: ComponentsNode) {
    const { parent, view } = this;
    let { children } = this;

    if (children) {
      children = children.filter(child => child !== node);
      children = children.length ? children : undefined;
      this.children = children;
    }

    if (!children && !view && parent) {
      parent.handleChildRemoved(this);
    }
  }
}
