import { __decorate } from "tslib";
import { isString } from '../../utils/lang/string';
import { HoldBehaviour } from './HoldBehaviour';
import { on } from '../../utils/dom/event';
import { property, update, View } from '../../core';
import { Scroller, scrollerScrollEvent } from '../Scroller';
import { toAxis } from '../../core/pointers/DragBehaviour';
const buttonParam = (name) => ({
    className: `${process.env.TYNY_PREFIX}ScrollerArrows--button ${name}`,
    defaultValue: `button.${name}`,
    tagName: 'button',
    type: 'element',
});
export class ScrollerArrows extends View {
    constructor(options) {
        super(options);
        this.epsilon = 1;
        this.isStalled = false;
        this.targetListeners = null;
        this.addBehaviour(HoldBehaviour, options.hold);
    }
    get target() {
        const target = this.params.read({ name: 'target' });
        if (target instanceof Scroller) {
            return target;
        }
        else if (isString(target)) {
            return this.findView(target, Scroller);
        }
        else {
            return null;
        }
    }
    setTarget(value) {
        this.params.options.target = value;
        this.onTargetChanged(value);
    }
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
    onTargetChanged(target) {
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
    setStalled(value) {
        if (this.isStalled === value)
            return;
        this.isStalled = value;
        this.toggleClass('stalled', value);
    }
}
__decorate([
    property({ param: { defaultValue: 'horizontal', type: 'string' } })
], ScrollerArrows.prototype, "direction", void 0);
__decorate([
    property({ immediate: true, param: buttonParam('backward') })
], ScrollerArrows.prototype, "backward", void 0);
__decorate([
    property({ immediate: true, param: buttonParam('forward') })
], ScrollerArrows.prototype, "forward", void 0);
__decorate([
    property({ immediate: true, watch: 'onTargetChanged' })
], ScrollerArrows.prototype, "target", null);
__decorate([
    update({ events: ['resize', 'update'] })
], ScrollerArrows.prototype, "onMeasure", null);
