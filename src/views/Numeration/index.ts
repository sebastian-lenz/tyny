import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { property } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import {
  AbstractNumeration,
  AbstractNumerationOptions,
} from './AbstractNumeration';

export const numerationChangeEvent = 'tyny:numerationChange';

export interface NumerationEventArgs {
  index: number;
  target: Numeration;
}

export interface NumerationOptions extends AbstractNumerationOptions {
  ignoreUndecided?: boolean;
}

export class Numeration extends AbstractNumeration {
  public ignoreUndecided?: boolean;
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
    super(options);

    const { ignoreUndecided = true } = options;
    this.ignoreUndecided = ignoreUndecided;
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
      _targetListeners.forEach((off) => off());
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
