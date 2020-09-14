import { CollectionView, CollectionViewOptions } from '../CollectionView';
import { update } from '../../core';

export interface MasonryOptions extends CollectionViewOptions {
  strategy?: MasonryStrategy;
}

export interface MasonryStrategy {
  apply(): Function[];
  setMasonry(value: Masonry | null): void;
}

export class Masonry<
  TItem extends HTMLElement = HTMLElement
> extends CollectionView<TItem> {
  //
  protected _strategy: MasonryStrategy | null;

  constructor(options: MasonryOptions = {}) {
    super(options);
    this._strategy = options.strategy || null;
  }

  get container(): HTMLElement {
    return this.el;
  }

  get strategy(): MasonryStrategy | null {
    return this._strategy;
  }

  set strategy(value: MasonryStrategy | null) {
    const { _strategy } = this;
    if (_strategy === value) return;

    if (_strategy) {
      _strategy.setMasonry(null);
    }

    if (value) {
      value.setMasonry(this);
    }

    this._strategy = value;
    this.callUpdate();
  }

  @update({ events: ['resize', 'update'], mode: 'read' })
  protected onMeasure() {
    const { _strategy } = this;
    if (!_strategy) {
      return;
    }

    const updates = _strategy.apply();
    if (updates.length) {
      return () => {
        updates.forEach((update) => update());
      };
    }
  }
}
