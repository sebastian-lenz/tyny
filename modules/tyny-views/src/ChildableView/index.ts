import { $, View, ViewClass, ViewOptions } from 'tyny';

import ChildableViewEvent from './ChildableViewEvent';

/**
 * Constructor options for the ChildableView class.
 */
export interface ChildableViewOptions extends ViewOptions {
  /**
   * A css selector or an element used as the container for all children.
   */
  container?: string | HTMLElement;

  /**
   * A css selector used to discover existing children.
   */
  selector?: string;

  /**
   * Default view class used to construct children.
   */
  viewClass?: ViewClass;

  viewOptions?: ViewOptions;
}

/**
 * A view that contains a list of child views.
 *
 * @event "add" (child: ChildType, at: number): void
 *   Triggered after a child has been added to this view.
 * @event "remove" (child: ChildType, at: number): void
 *   Triggered after a child has been removed to this view.
 */
export default class ChildableView<
  TOptions extends ChildableViewOptions = ChildableViewOptions,
  TChild extends View = View
> extends View<TOptions> {
  /**
   * The container children will be placed in.
   */
  @$.data({ type: 'element' })
  protected container: HTMLElement;

  /**
   * Default view class used to construct children.
   */
  @$.data({ type: 'any', defaultValue: View })
  protected viewClass: ViewClass;

  @$.data({ type: 'any' })
  protected viewOptions?: ViewOptions;

  /**
   * The list of children attached to this view.
   */
  protected children: TChild[] = [];

  /**
   * Add the given child view to this view.
   *
   * @param child
   *   The child view that should be added to this view.
   * @param at
   *   Optional index the child should be inserted at.
   */
  addChild(child: TChild, at?: number): this {
    const { children, container } = this;
    const count = children.length;

    if (at === void 0 || at >= count) {
      at = count;
      container.appendChild(child.element);
      children.push(child);
    } else if (at <= 0) {
      at = 0;
      container.insertBefore(child.element, container.firstChild);
      children.unshift(child);
    } else {
      container.insertBefore(child.element, children[at].element);
      children.splice(at, 0, child);
    }

    this.handleChildAdd(child, at);
    return this;
  }

  /**
   * Add the given list of child views to this view.
   *
   * @param children
   *   The list of child views that should be added to this view.
   * @param at
   *   Optional index the child should be inserted at.
   */
  addChildren(children: TChild[], at?: number): this {
    for (let index = 0, count = children.length; index < count; index++) {
      this.addChild(children[index], at ? at + index : at);
    }

    return this;
  }

  getChild(index: number): TChild | undefined {
    return this.children[index];
  }

  getLength(): number {
    return this.children.length;
  }

  indexOf(child: TChild): number {
    return this.children.indexOf(child);
  }

  /**
   * Remove all children from this view.
   */
  removeAllChildren(): this {
    const { children } = this;
    let child: TChild | undefined;

    while ((child = children.pop())) {
      this.handleChildRemove(child, children.length);
      child.dispose();
    }

    children.length = 0;
    return this;
  }

  /**
   * Remove the given child view from this view.
   *
   * @param child
   *   The child view that should be removed.
   */
  removeChild(child: TChild): this {
    const { children } = this;
    const index = children.indexOf(child);
    if (index !== -1) {
      children.splice(index, 1);
      child.dispose();
      this.handleChildRemove(child, index);
    }

    return this;
  }

  /**
   * Remove the given list of child views from this view.
   *
   * @param children
   *   The list of child views that should be removed.
   */
  removeChildren(children: TChild[]): this {
    children.forEach(child => this.removeChild(child));
    return this;
  }

  /**
   * Create a new view instance for the given child element.
   *
   * @param element
   *   The dom element whose view instance should be created.
   * @returns
   *   A view instance for the given child element.
   */
  protected createView(element: HTMLElement): TChild {
    const { viewClass, viewOptions } = this;
    return new viewClass({
      ...viewOptions,
      element,
      owner: this,
    }) as TChild;
  }

  protected initialize(options: TOptions) {
    if (!this.container) this.container = this.element;
    const { selector } = options;
    const { children, container } = this;

    if (selector) {
      const elements = container.querySelectorAll(selector);
      for (let index = 0; index < elements.length; index++) {
        const element = <HTMLElement>elements[index];
        const child = this.createView(element);
        container.appendChild(child.element);
        children.push(child);
      }
    }
  }

  protected handleChildAdd(view: TChild, index: number) {
    this.emit(
      new ChildableViewEvent({
        index,
        target: this,
        type: ChildableViewEvent.addEvent,
        view,
      })
    );
  }

  protected handleChildRemove(view: TChild, index: number) {
    this.emit(
      new ChildableViewEvent({
        index,
        target: this,
        type: ChildableViewEvent.removeEvent,
        view,
      })
    );
  }
}
