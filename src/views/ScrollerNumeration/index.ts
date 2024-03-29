import { AbstractNumeration } from '../Numeration/AbstractNumeration';
import { clamp } from '../../utils/lang/number';
import { easeInOutCubic } from '../../fx/easings/easeInOutCubic';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import { property, update } from '../../core';
import { Scroller, ScrollerEventArgs, scrollerScrollEvent } from '../Scroller';

export interface ItemRect {
  xMax: number;
  yMax: number;
  xMin: number;
  yMin: number;
}

export class ScrollerNumeration extends AbstractNumeration {
  private _height: number = 0;
  private _rects: Array<ItemRect> = [];
  private _targetListeners: Function[] | null = null;
  private _width: number = 0;

  @property({ immediate: true, watch: 'onTargetChanged' })
  get target(): Scroller | null {
    const target = this.params.read<any>({ name: 'target' });
    if (target instanceof Scroller) {
      return target;
    } else if (isString(target)) {
      return this.findView(target, Scroller);
    } else {
      return null;
    }
  }

  @update({ events: ['resize'], mode: 'read' })
  protected onMeasure() {
    const { target } = this;
    if (!target) return;

    const { items, viewport, position } = target;
    const { x: scrollX, y: scrollY } = position;

    if (!viewport) return;
    const bounds = viewport.getBoundingClientRect();
    const { left: boundsX, top: boundsY } = bounds;

    const rects = items.map((item) => {
      let { height, width, left: x, top: y } = item.el.getBoundingClientRect();
      x = x - boundsX + scrollX;
      y = y - boundsY + scrollY;

      return {
        xMax: x + width,
        yMax: y + height,
        xMin: x,
        yMin: y,
      };
    });

    this._height = bounds.height;
    this._rects = rects;
    this._width = bounds.width;
    this.setLength(rects.length);
    return () => this.updateSelected(position);
  }

  protected onScrollChanged(event: CustomEvent<ScrollerEventArgs>) {
    this.updateSelected(event.detail.position);
  }

  protected onTargetChanged(target: Scroller | null) {
    const { _targetListeners } = this;
    if (_targetListeners) {
      _targetListeners.forEach((off) => off());
    }

    if (target) {
      const { el } = target;
      this._targetListeners = [
        on(el, scrollerScrollEvent, this.onScrollChanged, { scope: this }),
      ];

      this.setLength(target.items.length);
    }
  }

  protected selectIndex(index: number): void {
    const { target, _rects } = this;
    const { xMin: x, yMin: y } = _rects[index];

    if (target) {
      const duration = clamp(Math.sqrt(x * x + y * y) * 100, 250, 600);
      target.tweenTo(target.clampPosition({ x, y }), {
        duration,
        easing: easeInOutCubic,
      });
    }
  }

  protected updateSelected(position: tyny.Point) {
    const { _height, _rects, _width } = this;
    const { x, y } = position;
    let max = -1;
    let min = -1;

    for (let index = 0; index < _rects.length; index++) {
      const rect = _rects[index];
      if (rect.xMax - x < 0 || rect.yMax - y < 0) continue;
      if (rect.xMin - x > _width || rect.yMin - y > _height) break;
      if (min === -1) min = index;
      max = index;
    }

    this.setSelected({ min, max });
  }
}
