import { __rest } from "tslib";
import { easeInOutQuad } from '../../fx/easings/easeInOutQuad';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import { SlideEffect } from './effects/SlideEffect';
import { tween } from '../../fx/tween';
import { DragBehaviour, } from '../../core/pointers/DragBehaviour';
export class BrowseBehaviour extends DragBehaviour {
    constructor(view, _a) {
        var { enabled = true, effect = new SlideEffect() } = _a, options = __rest(_a, ["enabled", "effect"]);
        super(view, Object.assign({ direction: 'horizontal' }, options));
        this.initialOffset = 0;
        this.offset = null;
        this.preventNextClick = false;
        this.enabled = enabled;
        this.effect = effect;
        this.listeners = [
            on(view.el, 'click', this.onViewClick, { capture: true, scope: this }),
        ];
    }
    setOffset(value) {
        const { effect, offset, view } = this;
        if (offset === value) {
            return;
        }
        this.offset = value;
        if (value === null) {
            effect.clear();
        }
        else {
            const index = value !== null ? Math.floor(value) : Number.NaN;
            const from = view.at(view.normalizeIndex(index));
            const to = view.at(view.normalizeIndex(index + 1));
            effect.apply(from, to, value - index);
        }
    }
    // Drag API
    // --------
    onDragBegin(event, pointer) {
        const { offset, view } = this;
        if (view.length < 2 ||
            !view.onBrowseBegin(event, pointer) ||
            !this.enabled) {
            return false;
        }
        this.initialOffset = offset === null ? view.currentIndex : offset;
        this.setOffset(this.initialOffset);
        stop(view);
        stop(this);
        view.immediate(null);
        if (!this.usePassiveEvents)
            event.preventDefault();
        return true;
    }
    onDrag(event, pointer) {
        const { direction, initialOffset, view } = this;
        const { viewport = view.el } = view;
        if (!this.usePassiveEvents)
            event.preventDefault();
        const delta = pointer.delta;
        let offset = initialOffset;
        if (direction === 'horizontal') {
            offset -= delta.x / viewport.clientWidth;
        }
        else {
            offset -= delta.y / viewport.clientHeight;
        }
        this.setOffset(offset);
        return true;
    }
    onDragEnd(event, pointer) {
        const { view } = this;
        this.preventNextClick = true;
        const force = this.getForce(pointer);
        const offset = this.getOffsetTarget(force);
        const options = {
            easing: Math.abs(force) < 2 ? easeInOutQuad : easeOutExpo,
        };
        tween(this, { offset }, options).then(() => {
            this.setOffset(null);
            view.onBrowseEnd(event, pointer);
            view.immediate(view.at(view.normalizeIndex(offset)));
        });
    }
    // methods
    // -----------------
    getForce(pointer) {
        const { clientX, clientY } = pointer.velocity.get();
        return this.direction === 'horizontal' ? clientX : clientY;
    }
    getOffsetTarget(force) {
        const offset = this.offset || 0;
        if (force < -5) {
            return Math.ceil(offset);
        }
        else if (force > 5) {
            return Math.floor(offset);
        }
        return Math.round(offset);
    }
    onDestroyed() {
        super.onDestroyed();
        if (this.listeners) {
            this.listeners.forEach((off) => off());
            this.listeners = null;
        }
    }
    onViewClick(event) {
        if (this.preventNextClick) {
            this.preventNextClick = false;
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
