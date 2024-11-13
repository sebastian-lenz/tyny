import { __decorate } from "tslib";
import { AbstractNumeration } from '../Numeration/AbstractNumeration';
import { clamp } from '../../utils/lang/number';
import { easeInOutCubic } from '../../fx/easings/easeInOutCubic';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import { property, update } from '../../core';
import { Scroller, scrollerScrollEvent } from '../Scroller';
export class ScrollerNumeration extends AbstractNumeration {
    constructor() {
        super(...arguments);
        this.epsilon = 0;
        this.height = 0;
        this.rects = [];
        this.targetListeners = null;
        this.width = 0;
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
    onMeasure() {
        const { target } = this;
        if (!target)
            return;
        const { items, viewport, position } = target;
        const { x: scrollX, y: scrollY } = position;
        if (!viewport)
            return;
        const bounds = viewport.getBoundingClientRect();
        const { left: boundsX, top: boundsY } = bounds;
        const rects = items.map((item) => {
            let { height, width, left: x, top: y } = item.el.getBoundingClientRect();
            x = x - boundsX + scrollX;
            y = y - boundsY + scrollY;
            return {
                xMax: x + width,
                yMax: y + height,
                xMin: x,
                yMin: y,
            };
        });
        this.height = bounds.height;
        this.rects = rects;
        this.width = bounds.width;
        this.setLength(rects.length);
        return () => this.updateSelected(position);
    }
    onScrollChanged(event) {
        this.updateSelected(event.detail.position);
    }
    onTargetChanged(target) {
        const { targetListeners } = this;
        if (targetListeners) {
            targetListeners.forEach((off) => off());
        }
        if (target) {
            const { el } = target;
            this.targetListeners = [
                on(el, scrollerScrollEvent, this.onScrollChanged, { scope: this }),
            ];
            this.setLength(target.items.length);
        }
    }
    selectIndex(index) {
        const { target, rects } = this;
        const { xMin: x, yMin: y } = rects[index];
        if (target) {
            const duration = clamp(Math.sqrt(x * x + y * y) * 100, 250, 600);
            target.tweenTo(target.clampPosition({ x, y }), {
                duration,
                easing: easeInOutCubic,
            });
        }
    }
    updateSelected(position) {
        const { epsilon, height, rects, width } = this;
        const { x, y } = position;
        let max = -1;
        let min = -1;
        for (let index = 0; index < rects.length; index++) {
            const rect = rects[index];
            if (rect.xMax - x < -epsilon || rect.yMax - y < -epsilon)
                continue;
            if (rect.xMin - x > width + epsilon || rect.yMin - y > height + epsilon)
                break;
            if (min === -1)
                min = index;
            max = index;
        }
        this.setSelected({ min, max });
    }
}
__decorate([
    property({ immediate: true, watch: 'onTargetChanged' })
], ScrollerNumeration.prototype, "target", null);
__decorate([
    update({ events: ['resize'], mode: 'read' })
], ScrollerNumeration.prototype, "onMeasure", null);
