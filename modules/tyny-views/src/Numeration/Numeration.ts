import { $, DelegatedEvent, View, ViewOptions } from 'tyny';
import { IntervalType } from 'tyny-utils';

import { ChildableViewEvent } from '../ChildableView';
import { CycleableView, CycleableViewEvent } from '../CycleableView';
import NumerationEvent from './NumerationEvent';

/**
 * Constructor options for the Numeration class.
 */
export interface NumerationOptions extends ViewOptions {
  /**
   * The CycleableView that should be controlled.
   */
  owner?: CycleableView;

  itemClass?: string;

  selectedItemClass?: string;
}

export default class Numeration extends View {
  /**
   * The CycleableView that should be controlled.
   */
  view: CycleableView | undefined;

  /**
   * A list of items wihtin the numeration.
   */
  items: HTMLLIElement[] = [];

  /**
   * The index of the currently highlighted item.
   */
  selectedRange: IntervalType = { min: -1, max: -1 };

  itemClass: string;

  selectedItemClass: string;

  /**
   * Numeration constructor.
   *
   * @param options
   *   The constructor options.
   */
  constructor(options: NumerationOptions = {}) {
    super({
      className: `${View.classNamePrefix}Numeration`,
      ...options,
      tagName: 'ul',
    });

    const {
      itemClass = `${View.classNamePrefix}Numeration--item`,
      owner,
      selectedItemClass = 'selected',
    } = options;

    this.itemClass = itemClass;
    this.selectedItemClass = selectedItemClass;

    if (owner instanceof CycleableView) {
      this.setView(owner);
    }
  }

  /**
   * Set the CycleableView that should be controlled.
   *
   * @param view
   *   The CycleableView that should be controlled.
   */
  setView(view: CycleableView): this {
    if (this.view === view) return this;

    if (this.view) {
      this.stopListening(this.view);
    }

    if (view) {
      this.setLength(view.getLength())
        .setSelectedIndex(view.getCurrentIndex())
        .listenTo(
          view,
          CycleableViewEvent.changeEvent,
          this.handleCurrentChanged
        )
        .listenTo(view, ChildableViewEvent.addEvent, this.handleLengthChanged)
        .listenTo(
          view,
          ChildableViewEvent.removeEvent,
          this.handleLengthChanged
        );
    }

    this.view = view;
    return this;
  }

  /**
   * Set the number of children of the controlled view.
   *
   * @param length
   *   The number of children of the controlled view.
   */
  setLength(length: number): this {
    const items = this.items;
    let itemsLength = items.length;

    if (itemsLength == length) {
      return this;
    }

    while (itemsLength < length) {
      let item = document.createElement('li');
      item.className = this.itemClass;
      item.innerText = `${itemsLength + 1}`;

      items.push(item);
      itemsLength += 1;
      this.element.appendChild(item);
    }

    while (itemsLength > length) {
      let child = items.pop();
      if (child) {
        this.element.removeChild(child);
      }

      itemsLength -= 1;
    }

    this.setSelected(this.selectedRange);
    return this;
  }

  /**
   * Set the index of the current item.
   *
   * @param index
   *   The index of the current item.
   */
  setSelectedIndex(index: number): this {
    return this.setSelected({ min: index, max: index });
  }

  setSelected(range: IntervalType): this {
    const { items, selectedRange, selectedItemClass } = this;
    const length = items.length - 1;
    let { min, max } = range;
    min = Math.max(-1, Math.min(length, Math.floor(min)));
    max = Math.max(-1, Math.min(length, Math.ceil(max)));

    if (max < min) {
      let tmp = min;
      min = max;
      max = tmp;
    }

    if (selectedRange.min == min && selectedRange.max == max) {
      return this;
    }

    for (let index = 0; index <= length; index++) {
      items[index].classList.toggle(
        selectedItemClass,
        index >= min && index <= max
      );
    }

    selectedRange.min = min;
    selectedRange.max = max;
    return this;
  }

  /**
   * Triggered if the user clicks on this view.
   *
   * @param event
   *   The triggering event.
   */
  @$.delegate('click', { selector: 'li' })
  handleClick(event: DelegatedEvent) {
    const index = this.items.indexOf(<any>event.delegateTarget);
    if (index !== -1) {
      this.handleSelectIndex(index);
    }

    return true;
  }

  handleSelectIndex(index: number) {
    if (this.view) {
      this.view.setCurrentIndex(index);
    } else {
      this.emit(
        new NumerationEvent({
          index,
          target: this,
          type: NumerationEvent.changeEvent,
        })
      );
    }
  }

  /**
   * Triggered after the current index of the view has changed.
   */
  handleCurrentChanged() {
    if (this.view) {
      this.setSelectedIndex(this.view.getCurrentIndex());
    }
  }

  handleLengthChanged() {
    if (this.view) {
      this.setLength(this.view.getLength());
    }
  }
}
