import { CycleableView } from '../CycleableView';
import { event, View, ViewOptions } from '../../core';

export const numerationChangeEvent = 'tyny:numerationChange';

export interface AbstractNumerationOptions extends ViewOptions {
  container?: HTMLElement | string;
  itemClass?: string;
  itemTagName?: string;
  selectedItemClass?: string;
  target?: CycleableView | string;
}

export abstract class AbstractNumeration extends View {
  public container: HTMLElement;
  public itemClass: string;
  public items: HTMLElement[] = [];
  public itemTagName: string;
  public selectedItemClass: string;
  public selectedRange: tyny.Interval = { min: -1, max: -1 };

  constructor(options: AbstractNumerationOptions = {}) {
    super({
      tagName: 'ul',
      ...options,
    });

    const {
      itemClass = `${this.component.className}--item`,
      itemTagName = 'li',
      selectedItemClass = 'selected',
    } = options;

    this.itemClass = itemClass;
    this.itemTagName = itemTagName;
    this.selectedItemClass = selectedItemClass;
    this.container = this.params.element({
      name: 'container',
      defaultValue: this.el,
    });
  }

  setLength(length: number) {
    const { container, itemClass, items, itemTagName } = this;
    let itemsLength = items.length;

    if (itemsLength == length) {
      return this;
    }

    while (itemsLength < length) {
      let item = document.createElement(itemTagName);
      item.className = itemClass;
      item.innerText = `${itemsLength + 1}`;

      items.push(item);
      itemsLength += 1;
      container.appendChild(item);
    }

    while (itemsLength > length) {
      let child = items.pop();
      if (child) {
        container.removeChild(child);
      }

      itemsLength -= 1;
    }

    this.setSelected(this.selectedRange);
  }

  setSelected(range: tyny.Interval) {
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

  setSelectedIndex(index: number) {
    this.setSelected({ min: index, max: index });
  }

  @event({ name: 'click' })
  protected onClick(event: MouseEvent) {
    const { el, items } = this;
    let target = event.target as HTMLElement | null;

    while (target) {
      const index = items.indexOf(target);
      if (index !== -1) {
        return this.selectIndex(index);
      }

      if (target === el) return;
      target = target.parentElement;
    }
  }

  protected abstract selectIndex(index: number): void;
}
