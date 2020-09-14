import { clamp } from '../../../utils/lang/number';
import { Effect } from './Effect';
import { transform } from '../../../utils/env/transformProps';

export class SlideEffect extends Effect {
  translation: 'translateX' | 'translateY' = 'translateX';

  protected applyFrom(element: HTMLElement, value: number) {
    const { translation } = this;
    element.style[transform] = `${translation}(${value * -100}%)`;
    element.style.opacity = `${clamp(1 - value)}`;
  }

  protected applyTo(element: HTMLElement, value: number) {
    const { translation } = this;
    element.style[transform] = `${translation}(${100 + value * -100}%)`;
    element.style.opacity = `${clamp(value)}`;
  }

  protected clearElement(element: HTMLElement) {
    element.style[transform] = '';
    element.style.opacity = '';
  }
}
