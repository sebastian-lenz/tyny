import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { event, property, View, ViewOptions } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';

export const numerationChangeEvent = 'tyny:numerationChange';

export interface NumerationEventArgs {
  index: number;
  target: Numeration;
}

export interface NumerationOptions extends ViewOptions {
  container?: HTMLElement | string;
  ignoreUndecided?: boolean;
  itemClass?: string;
  itemTagName?: string;
  selectedItemClass?: string;
  target?: CycleableView | string;
}

export class Numeration extends View {
  public container: HTMLElement;
  public ignoreUndecided?: boolean;
  public itemClass: string;
  public items: HTMLElement[] = [];
  public itemTagName: string;
  public selectedItemClass: string;
  public selectedRange: tyny.Interval = { min: -1, max: -1 };
  private _targetListeners: Function[] | null = null;

  @property({ immediate: true, watch: 'onTargetChanged' })
  get target(): CycleableView | null {
    const target = this.params.read<any>({ name: 'target' });
    if (target instanceof CycleableView) {
      return target;
    } else if (isString(target)) {
      return this.findView(target, CycleableView);
    } else {
      return null;
    }
  }

  constructor(options: NumerationOptions = {}) {
    super({
      tagName: 'ul',
      ...options,
    });

    const {
      ignoreUndecided = true,
      itemClass = `${this.component.className}--item`,
      itemTagName = 'li',
      selectedItemClass = 'selected',
    } = options;

    this.ignoreUndecided = ignoreUndecided;
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

  protected onCurrentChanged() {
    const { ignoreUndecided, target } = this;
    if (!target) {
      return;
    }

    const { currentIndex } = target;
    if (ignoreUndecided && currentIndex === -1) {
      return;
    }

    this.setSelectedIndex(currentIndex);
  }

  protected onLengthChanged() {
    const { target } = this;
    if (target) {
      this.setLength(target.length);
    }
  }

  protected onTargetChanged(target: CycleableView | null) {
    const { _targetListeners } = this;
    if (_targetListeners) {
      _targetListeners.forEach((listener) => listener());
    }

    if (target) {
      const { el } = target;
      this._targetListeners = [
        on(el, collectionChangedEvent, this.onLengthChanged, { scope: this }),
        on(el, transistEvent, this.onCurrentChanged, { scope: this }),
      ];

      this.setLength(target.length);
      this.setSelectedIndex(target.currentIndex);
    }
  }

  protected selectIndex(index: number) {
    const { target } = this;
    if (target) {
      target.currentIndex = index;
    } else {
      this.trigger(numerationChangeEvent, <NumerationEventArgs>{
        index,
        target: this,
      });
    }
  }
}
