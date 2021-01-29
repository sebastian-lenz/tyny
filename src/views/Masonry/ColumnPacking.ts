import { clamp } from '../../utils/lang/number/clamp';
import { Column, ColumnRegion } from './Column';
import { isEqual } from '../../utils/lang/object';

import type { Masonry, MasonryStrategy } from './index';

function applyStyle(
  el: HTMLElement,
  last?: Partial<CSSStyleDeclaration>,
  next?: Partial<CSSStyleDeclaration>
): Function {
  return () => {
    if (last) for (const key in last) el.style[key] = '';
    if (next) for (const key in next) el.style[key] = next[key] as string;
  };
}

export type ColumnCount = number | { (masonry: Masonry): number };

export interface ColumnPackingOptions {
  columnCount: ColumnCount;
  gutter?: number;
}

export interface ColumnPackingItem {
  el: HTMLElement;
  style: Partial<CSSStyleDeclaration>;
}

export class ColumnPacking implements MasonryStrategy {
  columnCount: ColumnCount;
  gutter: number = 0;
  protected columns: Column[] = [];
  protected columnWidth: number = 0;
  protected height: number = 0;
  protected items: ColumnPackingItem[] = [];
  protected masonry: Masonry | null = null;
  protected width: number = 0;

  constructor({ columnCount, gutter = 0 }: ColumnPackingOptions) {
    this.columnCount = columnCount;
    this.gutter = gutter;
  }

  apply(): Function[] {
    const { items, masonry } = this;
    const result: Function[] = [];
    if (!masonry || !this.reset(masonry)) {
      return result;
    }

    this.items = masonry.items.map((el) => {
      const last = items.find((item) => item.el === el);
      const next = this.place(el);

      if (!last || !isEqual(last.style, next.style)) {
        result.push(applyStyle(el, last?.style, next.style));
      }

      return next;
    });

    const height = this.getMaxHeight();
    if (height !== this.height) {
      this.height = height;
      result.push(() => {
        masonry.container.style.height = `${height}px`;
      });
    }

    return result;
  }

  setMasonry(value: Masonry | null) {
    const { masonry } = this;
    if (masonry === value) return;

    this.items.forEach((item) => applyStyle(item.el, item.style)());
    if (masonry) {
      masonry.el.style.height = '';
    }

    this.columns.length = 0;
    this.height = 0;
    this.items.length = 0;
    this.masonry = value;
    this.width = 0;
  }

  protected findPosition(el: HTMLElement): ColumnRegion | null {
    const { columns } = this;
    const positions: ColumnRegion[] = [];
    const height = el.clientHeight + this.gutter;
    const width = this.getColumnsFromWidth(el.clientWidth);

    const max = columns.length - width + 1;
    for (let index = 0; index < max; index++) {
      columns[index].getAllPositions(width, height, positions);
    }

    positions.sort((a, b) => {
      if (a.y != b.y) return a.y - b.y;
      if (a.x == b.x) return 0;
      return a.x - b.x;
    });

    const result = positions[0];
    return result ? columns[result.x].reserve(result) : null;
  }

  protected getColumnCount(masonry: Masonry): number {
    const { columnCount } = this;
    return typeof columnCount === 'number' ? columnCount : columnCount(masonry);
  }

  protected getColumnsFromWidth(width: number): number {
    const { columns, columnWidth } = this;
    const max = Math.min(columns.length - 1);

    return clamp(Math.round(width / columnWidth), 1, max);
  }

  protected getMaxHeight(): number {
    const { columns, gutter } = this;
    const height = columns.reduce(
      (height, column) => Math.max(height, column.getMaxHeight()),
      0
    );

    return height - gutter;
  }

  protected place(el: HTMLElement): ColumnPackingItem {
    const { columnWidth, gutter } = this;
    const position = this.findPosition(el);
    const style: Partial<CSSStyleDeclaration> = {};

    if (position) {
      style.position = 'absolute';
      style.top = `${position.y}px`;
      style.left = `${position.x * (columnWidth + gutter)}px`;
    } else {
      style.visibility = 'hidden';
    }

    return { el, style };
  }

  private reset(masonry: Masonry): boolean {
    const { gutter } = this;
    const count = this.getColumnCount(masonry);
    const width = masonry.container.offsetWidth;

    if (this.columns.length === count && this.width === width) {
      return false;
    }

    const columns: Column[] = [];
    for (let index = count - 1; index >= 0; index--) {
      columns[index] = new Column(index, columns[index + 1] || null);
    }

    this.columns = columns;
    this.columnWidth = (width - gutter * (count - 1)) / count;
    this.width = width;
    return true;
  }
}
