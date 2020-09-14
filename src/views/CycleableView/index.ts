import { CollectionView, CollectionViewOptions } from '../CollectionView';
import { isNumber } from '../../utils/lang/number/isNumber';
import { isUndefined } from '../../utils/lang/misc';
import { property } from '../../core';

export const transistEvent = 'tyny:transist';

export interface CycleableViewOptions extends CollectionViewOptions {
  initialIndex?: number;
  isLooped?: boolean;
}

export class CycleableView<
  TTransitionOptions = any,
  TItem extends HTMLElement = HTMLElement
> extends CollectionView<TItem> {
  //
  private _current: TItem | null = null;

  @property({ param: { defaultValue: false, type: 'bool' } })
  isLooped!: boolean;

  get current(): TItem | null {
    return this._current;
  }

  set current(value: TItem | null) {
    this.transist(value);
  }

  get currentIndex(): number {
    const { _current: current } = this;
    return current ? this.indexOf(current) : -1;
  }

  set currentIndex(value: number) {
    this.transist(value);
  }

  get next(): TItem | null {
    return this.at(this.normalizeIndex(this.currentIndex + 1));
  }

  get previous(): TItem | null {
    return this.at(this.normalizeIndex(this.currentIndex - 1));
  }

  constructor(options: CycleableViewOptions = {}) {
    super(options);
  }

  immediate(value: TItem | null) {
    this.transist(value);
  }

  normalizeIndex(index: number): number {
    const { isLooped, length } = this;
    if (length < 1) {
      return -1;
    }

    let normalized = index;
    if (isLooped) {
      while (normalized < 0) normalized += length;
      while (normalized >= length) normalized -= length;
    } else {
      if (normalized < 0) return -1;
      if (normalized >= length) return -1;
    }

    return normalized;
  }

  transist(value: TItem | number | null, options?: TTransitionOptions) {
    const from = this._current;
    const to = isNumber(value) ? this.at(this.normalizeIndex(value)) : value;
    if (from === to) return;

    this._current = to;

    this.onTransition(from, to, options);
    this.trigger(transistEvent, {
      from,
      options,
      target: this,
      to,
    });
  }

  protected onConnected() {
    const initialIndex = this.params.int({ name: 'initialIndex' });
    if (!isUndefined(initialIndex)) {
      this.transist(initialIndex);
    }
  }

  protected onTransition(
    from: TItem | null,
    to: TItem | null,
    options?: TTransitionOptions
  ) {}
}
