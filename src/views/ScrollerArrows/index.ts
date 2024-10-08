import { isString } from '../../utils/lang/string';
import { HoldBehaviour, HoldBehaviourOptions } from './HoldBehaviour';
import { on } from '../../utils/dom/event';
import { property, update, View, ViewOptions } from '../../core';
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
  hold?: HoldBehaviourOptions;
  target?: Scroller | string;
}

export class ScrollerArrows extends View {
  epsilon: number = 1;
  isStalled: boolean = false;
  targetListeners: Function[] | null = null;

  @property({ param: { defaultValue: 'horizontal', type: 'string' } })
  direction!: DragDirection;

  @property({ immediate: true, param: buttonParam('backward') })
  backward!: HTMLButtonElement;

  @property({ immediate: true, param: buttonParam('forward') })
  forward!: HTMLButtonElement;

  constructor(options: ScrollerArrowsOptions) {
    super(options);

    this.addBehaviour(HoldBehaviour, options.hold);
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

  setTarget(value: Scroller | null) {
    this.params.options.target = value;
    this.onTargetChanged(value);
  }

  @update({ events: ['resize', 'update'] })
  onMeasure() {
    return this.onScrollerChanged;
  }

  onScrollerChanged() {
    const { backward, epsilon, forward, target } = this;
    const axis = toAxis(this.direction);

    if (target) {
      const { position: pos, positionBounds: bounds } = target;
      backward.disabled = pos[axis] - epsilon <= bounds[`${axis}Min`];
      forward.disabled = pos[axis] + epsilon >= bounds[`${axis}Max`];

      this.setStalled(backward.disabled && forward.disabled);
    }
  }

  onTargetChanged(target: Scroller | null) {
    const { targetListeners: _targetListeners } = this;
    if (_targetListeners) {
      _targetListeners.forEach((off) => off());
    }

    if (target) {
      this.targetListeners = [
        on(target.el, scrollerScrollEvent, this.onScrollerChanged, {
          scope: this,
        }),
      ];
    }
  }

  setStalled(value: boolean) {
    if (this.isStalled === value) return;

    this.isStalled = value;
    this.toggleClass('stalled', value);
  }
}
