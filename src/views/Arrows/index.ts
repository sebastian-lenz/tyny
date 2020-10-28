import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { event, property, View, ViewOptions } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';

const buttonParam = (name: string) => ({
  className: `${process.env.TYNY_PREFIX}Arrows--button ${name}`,
  defaultValue: `button.${name}`,
  tagName: 'button',
  type: 'element' as 'element',
});

export interface ArrowsOptions extends ViewOptions {
  target?: CycleableView | string;
}

export class Arrows extends View {
  protected stopListening: Function[] | null = null;

  @property({ param: buttonParam('backward') })
  backward!: HTMLButtonElement;

  @property({ param: buttonParam('forward') })
  forward!: HTMLButtonElement;

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

  protected navigateBy(step: number) {
    const { target } = this;
    if (target) {
      target.currentIndex += step;
    }
  }

  protected onChanged() {
    const { el, target } = this;
    el.classList.toggle('disabled', !target || target.length < 2);
  }

  @event({ name: 'click' })
  protected onClick(event: tyny.DelegateEvent) {
    const { backward, forward } = this;
    let target = event.target as HTMLElement | null;

    while (target) {
      if (target === backward) {
        return this.navigateBy(-1);
      } else if (target === forward) {
        return this.navigateBy(1);
      }

      target = target.parentElement;
    }
  }

  protected onTargetChanged() {
    const { stopListening, target } = this;
    if (stopListening) {
      stopListening.forEach((off) => off());
    }

    if (target) {
      const { el } = target;
      const options = { scope: this };

      this.onChanged();
      this.stopListening = [
        on(el, collectionChangedEvent, this.onChanged, options),
        on(el, transistEvent, this.onTransist, options),
      ];
    } else {
      this.stopListening = null;
    }
  }

  protected onTransist() {
    const { backward, forward, target } = this;
    if (!target || target.isLooped) {
      return;
    }

    const index = target.currentIndex;
    backward.disabled = index <= 0;
    forward.disabled = index >= target.length - 1;
  }
}
