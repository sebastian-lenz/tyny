import { $, View } from 'tyny';

import ChildableView, { ChildableViewOptions } from '../ChildableView/index';
import CycleableViewEvent from './CycleableViewEvent';

/**
 * Constructor options for the CycleableView class.
 */
export interface CycleableViewOptions extends ChildableViewOptions {
  /**
   * The index of the child that should be initially selected.
   */
  initialIndex?: number;

  /**
   * Whether the children should be looped or not.
   */
  isLooped?: boolean;
}

/**
 * A childable view which is aware of a current child.
 *
 * @event "currentChanged" (newChild:T, oldChild:T, options:U):void
 *   Triggered after the current child has changed.
 */
export default class CycleableView<
  TOptions extends CycleableViewOptions = CycleableViewOptions,
  TChild extends View = View,
  TTransitionOptions = any
> extends ChildableView<TOptions, TChild> {
  /**
   * Whether the children should be looped or not.
   */
  @$.data({ type: 'bool', defaultValue: false })
  isLooped: boolean;

  /**
   * The currently selected child.
   */
  protected current: TChild | undefined;

  getCurrent(): TChild | undefined {
    return this.current;
  }

  /**
   * Return the index of the current child.
   */
  getCurrentIndex(): number {
    const { current } = this;
    return current ? this.indexOf(current) : -1;
  }

  /**
   * Return the previous child.
   */
  getNext(): TChild | undefined {
    return this.getChild(this.normalizeIndex(this.getCurrentIndex() + 1));
  }

  /**
   * Return the next child.
   */
  getPrevious(): TChild | undefined {
    return this.getChild(this.normalizeIndex(this.getCurrentIndex() - 1));
  }

  /**
   * Normalize the given index.
   */
  normalizeIndex(index: number): number {
    const count = this.getLength();
    if (count < 1) {
      return -1;
    }

    let normalized = index;
    if (this.isLooped) {
      while (normalized < 0) normalized += count;
      while (normalized >= count) normalized -= count;
    } else {
      if (normalized < 0) return -1;
      if (normalized >= count) return -1;
    }

    return normalized;
  }

  /**
   * Set the current child.
   */
  setCurrent(child: TChild | undefined, options?: TTransitionOptions): this {
    const { current: lastChild } = this;
    if (lastChild === child) {
      return this;
    }

    this.current = child;
    this.handleTransition(lastChild, child, options);

    this.emit(
      new CycleableViewEvent({
        fromView: lastChild,
        options,
        target: this,
        toView: child,
        type: CycleableViewEvent.changeEvent,
      })
    );

    return this;
  }

  /**
   * Set the index of the current child.
   *
   * @param index
   *   The index of the child that should be set as current.
   * @param options
   */
  setCurrentIndex(index: number, options?: TTransitionOptions): this {
    index = this.normalizeIndex(index);
    return this.setCurrent(this.getChild(index), options);
  }

  protected initialize(options: TOptions) {
    const { initialIndex } = options;
    if (initialIndex !== void 0) {
      this.setCurrentIndex(initialIndex);
    }
  }

  /**
   * Triggered after a child has been removed to this view.
   *
   * @param child
   *   The child view that has been removed.
   */
  protected handleChildRemove(child: TChild, index: number) {
    if (child === this.current) {
      this.setCurrent(undefined);
    }
  }

  /**
   * Internal transition handler. Creates a transition between the two given children.
   *
   * @param newChild
   *   The child the transition should lead to.
   * @param oldChild
   *   The child the transition should come from.
   * @param options
   *   Optional transition options.
   */
  protected handleTransition(
    from: TChild | undefined,
    to: TChild | undefined,
    options?: TTransitionOptions
  ) {}
}
