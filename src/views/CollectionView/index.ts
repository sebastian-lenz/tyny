import { View, ViewOptions, property } from '../../core';

export const collectionChangedEvent = 'tyny:collectionChanged';

export interface CollectionViewOptions extends ViewOptions {
  itemSelector?: string;
}

export interface CollectionViewEventArgs<
  TItem extends HTMLElement = HTMLElement
> {
  items: TItem[];
  target: CollectionView<TItem>;
}

export class CollectionView<
  TItem extends HTMLElement = HTMLElement
> extends View {
  @property({ param: { defaultValue: '> *', type: 'string' } })
  itemSelector!: string;

  @property({ watch: 'onItemsChanged' })
  get items(): TItem[] {
    return this.findAll(this.itemSelector) as TItem[];
  }

  get length(): number {
    return this.items.length;
  }

  constructor(options: CollectionViewOptions = {}) {
    super(options);
  }

  at(index: number): TItem | null {
    return this.items[index] || null;
  }

  contains(item: TItem): boolean {
    return this.indexOf(item) !== -1;
  }

  indexOf(item: TItem) {
    return this.items.indexOf(item);
  }

  protected onItemsChanged(items: TItem[]) {
    this.trigger(collectionChangedEvent, <CollectionViewEventArgs<TItem>>{
      items,
      target: this,
    });
  }
}
