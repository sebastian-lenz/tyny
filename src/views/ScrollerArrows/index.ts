import { isString } from '../../utils/lang/string';
import { HoldBehaviour } from './HoldBehaviour';
import { on } from '../../utils/dom/event';
import { property, View, ViewOptions } from '../../core';
import { Scroller, scrollerScrollEvent } from '../Scroller';
import { DragDirection, toAxis } from '../../core/pointers/DragBehaviour';

const buttonParam = (name: string) => ({
  className: `${process.env.TYNY_PREFIX}ScrollerArrows--button ${name}`,
  defaultValue: `button.${name}`,
  tagName: 'button',
  type: 'element' as 'element',
});

export interface ScrollerArrowsOptions extends ViewOptions {
  backward?: string | HTMLElement;
  direction?: DragDirection;
  forward?: string | HTMLElement;
  target?: Scroller | string;
}

export class ScrollerArrows extends View {
  protected _targetListeners: Function[] | null = null;

  @property({ param: { defaultValue: 'horizontal', type: 'string' } })
  direction!: DragDirection;

  @property({ immediate: true, param: buttonParam('backward') })
  backward!: HTMLButtonElement;

  @property({ immediate: true, param: buttonParam('forward') })
  forward!: HTMLButtonElement;

  constructor(options: ViewOptions) {
    super(options);

    this.addBehaviour(HoldBehaviour);
  }

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

  protected onScrollerChanged() {
    const { backward, forward, target } = this;
    const axis = toAxis(this.direction);

    if (target) {
      const { position, positionBounds } = target;
      backward.disabled =
        position[axis] <= positionBounds[`${axis}Min` as 'xMin' | 'yMin'];
      forward.disabled =
        position[axis] >= positionBounds[`${axis}Max` as 'xMax' | 'yMax'];
    }
  }

  protected onTargetChanged(target: Scroller | null) {
    const { _targetListeners } = this;
    if (_targetListeners) {
      _targetListeners.forEach((off) => off());
    }

    if (target) {
      this._targetListeners = [
        on(target.el, scrollerScrollEvent, this.onScrollerChanged, {
          scope: this,
        }),
      ];
    }
  }
}
