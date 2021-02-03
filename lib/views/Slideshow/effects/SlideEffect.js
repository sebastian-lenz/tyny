import { clamp } from '../../../utils/lang/number';
import { Effect } from './Effect';
import { transform } from '../../../utils/env/transformProps';
export class SlideEffect extends Effect {
    constructor({ translation = 'translateX', useOpacity = true, } = {}) {
        super();
        this.translation = translation;
        this.useOpacity = useOpacity;
    }
    applyFrom(element, value) {
        const { translation, useOpacity } = this;
        element.style[transform] = `${translation}(${value * -100}%)`;
        if (useOpacity) {
            element.style.opacity = `${clamp(1 - value)}`;
        }
    }
    applyTo(element, value) {
        const { translation, useOpacity } = this;
        element.style[transform] = `${translation}(${100 + value * -100}%)`;
        if (useOpacity) {
            element.style.opacity = `${clamp(value)}`;
        }
    }
    clearElement(element) {
        element.style[transform] = '';
        if (this.useOpacity) {
            element.style.opacity = '';
        }
    }
}
