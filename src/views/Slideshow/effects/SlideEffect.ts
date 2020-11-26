import { clamp } from '../../../utils/lang/number';
import { Effect } from './Effect';
import { transform } from '../../../utils/env/transformProps';

export type Translation = 'translateX' | 'translateY';

export interface SlideEffectOptions {
  translation?: Translation;
  useOpacity?: boolean;
}

export class SlideEffect extends Effect {
  translation: Translation;
  useOpacity: boolean;

  constructor({
    translation = 'translateX',
    useOpacity = true,
  }: SlideEffectOptions = {}) {
    super();

    this.translation = translation;
    this.useOpacity = useOpacity;
  }

  protected applyFrom(element: HTMLElement, value: number) {
    const { translation, useOpacity } = this;
    element.style[transform] = `${translation}(${value * -100}%)`;

    if (useOpacity) {
      element.style.opacity = `${clamp(1 - value)}`;
    }
  }

  protected applyTo(element: HTMLElement, value: number) {
    const { translation, useOpacity } = this;
    element.style[transform] = `${translation}(${100 + value * -100}%)`;

    if (useOpacity) {
      element.style.opacity = `${clamp(value)}`;
    }
  }

  protected clearElement(element: HTMLElement) {
    element.style[transform] = '';

    if (this.useOpacity) {
      element.style.opacity = '';
    }
  }
}
