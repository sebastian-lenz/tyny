import { viewport, ViewportEvent } from 'tyny-services/lib/viewport';

import { Component } from './Components';
import View, { ViewClass, ViewOptions } from '../View';
import { ComponentNode } from '../index';

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
  private allowChildComponents: boolean = false;
  private children: ComponentsNode[] | undefined;
  private element: HTMLElement;
  private parent: ComponentsNode | null;
  private postResizeHandler: Function | undefined;
  private preResizeHandler: Function | undefined;
  private view: View | undefined;
  private viewClass: ViewClass | undefined;

  constructor(element: HTMLElement, parent: ComponentsNode | null = null) {
    this.element = element;
    this.parent = parent;

    if (!parent) {
      viewport().on(ViewportEvent.resizeEvent, this.handleResize, this);
    }
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
    this.postResizeHandler = undefined;
    this.preResizeHandler = undefined;
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

  getRootNode(): ComponentNode {
    if (this.parent) {
      return this.parent.getRootNode();
    }

    return this;
  }

  getView(): View | undefined {
    return this.view;
  }

  hasView(): boolean {
    return !!this.view;
  }

  initializeAllViews(): View[] {
    const { allowChildComponents, children } = this;
    const result: View[] = [];
    const view = this.initializeView();

    if (view) {
      result.push(view);
      if (!allowChildComponents) {
        return result;
      }
    }

    if (children) {
      for (let index = 0; index < children.length; index++) {
        result.push(...children[index].initializeAllViews());
      }
    }

    return result;
  }

  initializeChildViews(): View[] {
    const { children } = this;
    const result: View[] = [];

    if (children) {
      for (let index = 0; index < children.length; index++) {
        result.push(...children[index].initializeAllViews());
      }
    }

    return result;
  }

  registerComponent(component: Component): ComponentsNode[] {
    const { allowChildComponents, selector, viewClass } = component;
    const { element } = this;
    const targets = element.querySelectorAll(selector);
    const result = [];

    for (let index = 0; index < targets.length; index++) {
      const target = targets[index];
      const node = this.createDescendant(target as HTMLElement);
      node.setViewClass(viewClass);
      node.allowChildComponents = !!allowChildComponents;
      result.push(node);
    }

    return result;
  }

  setResizeHandler(resizeHandler?: Function, beforeChildren?: boolean) {
    if (beforeChildren) {
      this.preResizeHandler = resizeHandler;
    } else {
      this.postResizeHandler = resizeHandler;
    }
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

  synchronize() {
    const { children, element } = this;
    if (!children) {
      return;
    }

    const root = this.getRootNode();
    let index = 0;

    while (index < children.length) {
      const child = children[index];
      const { parentElement } = child.element;

      if (parentElement !== element) {
        children.splice(index, 1);
        const parent = parentElement
          ? root.createDescendant(parentElement)
          : undefined;

        if (parent) {
          parent.insertChild(child);
        } else {
          child.dispose();
        }
      } else {
        index += 1;
      }

      child.synchronize();
    }
  }

  triggerLocalResize() {
    this.handleResize();
  }

  private createChild(element: HTMLElement): ComponentsNode {
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

  private getChildByElement(element: HTMLElement): ComponentsNode | undefined {
    const { children } = this;
    if (!children) return undefined;
    return children.find(child => child.element === element);
  }

  private getDescendantByElement(
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

  private initializeComponent(
    component: Component,
    options?: Partial<ViewOptions>
  ): View[] {
    const nodes = this.registerComponent(component);
    return nodes
      .map(node => node.initializeView(options))
      .filter((view): view is View => !!view);
  }

  private initializeView(options: Partial<ViewOptions> = {}): View | undefined {
    const { element, view, viewClass } = this;
    if (view || !viewClass) {
      return undefined;
    }

    this.view = new viewClass({
      ...options,
      element,
      componentNode: this,
    });

    return this.view;
  }

  private insertChild(node: ComponentNode) {
    let { children, element } = this;
    if (node.element.parentElement !== element) {
      throw new Error('Invalid operation');
    }

    if (children) {
      for (let index = 0; index < children.length; index++) {
        if (children[index].element === node.element) {
        }
      }
    } else {
      children = this.children = [];
    }

    children.push(node);
  }

  private handleResize() {
    const { children, postResizeHandler, preResizeHandler, view } = this;

    if (preResizeHandler) {
      preResizeHandler.call(view);
    }

    if (children) {
      for (let index = 0; index < children.length; index++) {
        children[index].handleResize();
      }
    }

    if (postResizeHandler) {
      postResizeHandler.call(view);
    }
  }

  private handleChildRemoved(node: ComponentsNode) {
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
