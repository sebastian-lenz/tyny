import { __decorate } from "tslib";
import { isString } from '../../utils/lang/string';
import { HoldBehaviour } from './HoldBehaviour';
import { on } from '../../utils/dom/event';
import { property, View } from '../../core';
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
        this._targetListeners = null;
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
    onScrollerChanged() {
        const { backward, forward, target } = this;
        const axis = toAxis(this.direction);
        if (target) {
            const { position, positionBounds } = target;
            backward.disabled =
                position[axis] <= positionBounds[`${axis}Min`];
            forward.disabled =
                position[axis] >= positionBounds[`${axis}Max`];
        }
    }
    onTargetChanged(target) {
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
