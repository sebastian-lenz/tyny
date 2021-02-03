import { __decorate } from "tslib";
import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { event, property, View } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
const buttonParam = (name) => ({
    className: `${process.env.TYNY_PREFIX}Arrows--button ${name}`,
    defaultValue: `button.${name}`,
    tagName: 'button',
    type: 'element',
});
export class Arrows extends View {
    constructor() {
        super(...arguments);
        this.stopListening = null;
    }
    get target() {
        const target = this.params.read({ name: 'target' });
        if (target instanceof CycleableView) {
            return target;
        }
        else if (isString(target)) {
            return this.findView(target, CycleableView);
        }
        else {
            return null;
        }
    }
    navigateBy(step) {
        const { target } = this;
        if (target) {
            target.currentIndex += step;
        }
    }
    onChanged() {
        const { el, target } = this;
        el.classList.toggle('disabled', !target || target.length < 2);
    }
    onClick(event) {
        const { backward, forward } = this;
        let target = event.target;
        while (target) {
            if (target === backward) {
                return this.navigateBy(-1);
            }
            else if (target === forward) {
                return this.navigateBy(1);
            }
            target = target.parentElement;
        }
    }
    onTargetChanged() {
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
        }
        else {
            this.stopListening = null;
        }
    }
    onTransist() {
        const { backward, forward, target } = this;
        if (!target || target.isLooped) {
            return;
        }
        const index = target.currentIndex;
        backward.disabled = index <= 0;
        forward.disabled = index >= target.length - 1;
    }
}
__decorate([
    property({ param: buttonParam('backward') })
], Arrows.prototype, "backward", void 0);
__decorate([
    property({ param: buttonParam('forward') })
], Arrows.prototype, "forward", void 0);
__decorate([
    property({ immediate: true, watch: 'onTargetChanged' })
], Arrows.prototype, "target", null);
__decorate([
    event({ name: 'click' })
], Arrows.prototype, "onClick", null);
