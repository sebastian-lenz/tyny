import { __decorate } from "tslib";
import { DragScrollBehaviour } from './DragScrollBehaviour';
import { stop } from '../../fx/dispatcher';
import { transform } from '../../utils/env/transformProps';
import { tween } from '../../fx/tween';
import { View, update, property } from '../../core';
import { findAll } from '../../utils/dom/node';
const createBounds = () => ({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
});
export const scrollerScrollEvent = 'tyny:scrollerScroll';
export class Scroller extends View {
    constructor(options) {
        super(options);
        this.currentTarget = null;
        this.currentTween = null;
        this.positionBounds = createBounds();
        this.viewportSize = { width: 0, height: 0 };
        const { direction = 'both', position = { x: 0, y: 0 } } = options;
        this.direction = direction;
        this._position = Object.assign({}, position);
        this.dragBehaviour = this.addBehaviour(DragScrollBehaviour, {
            direction,
            view: this,
        });
    }
    get items() {
        return findAll(this.itemSelector, this.content || this.el).map(this.createItem);
    }
    get isPositionPaged() {
        return false;
    }
    get position() {
        const { x, y } = this._position;
        return { x, y };
    }
    set position(value) {
        this.setPosition(value);
    }
    clampPosition(value) {
        const { xMin, xMax, yMin, yMax } = this.positionBounds;
        let { x, y } = value;
        if (x > xMax)
            x = xMax;
        if (x < xMin)
            x = xMin;
        if (y > yMax)
            y = yMax;
        if (y < yMin)
            y = yMin;
        return { x, y };
    }
    createItem(el) {
        return { el };
    }
    gotoPosition(value) {
        stop(this);
        this.position = this.clampPosition(value);
    }
    setPosition(value) {
        const { _position, content, direction } = this;
        if (direction !== 'vertical')
            _position.x = value.x;
        if (direction !== 'horizontal')
            _position.y = value.y;
        if (content) {
            const { x, y } = this.toDisplayOffset(_position);
            content.style[transform] = `translate(${-x}px, ${-y}px)`;
        }
        this.trigger(scrollerScrollEvent, {
            target: this,
            position: Object.assign({}, _position),
        });
    }
    toDisplayOffset(value) {
        return value;
    }
    toLocalOffset(value) {
        return value;
    }
    tweenTo(position, options = {}) {
        let { currentTween } = this;
        this.currentTarget = position;
        if (currentTween) {
            currentTween.advance({ position }, options);
        }
        else {
            this.currentTween = currentTween = tween(this, { position }, Object.assign(Object.assign({}, options), { rejectOnStop: true }));
            const reset = () => (this.currentTween = this.currentTarget = null);
            currentTween.then(reset, reset);
        }
    }
    onMeasure() {
        const { content, useContentMargins, viewport, viewportSize } = this;
        const bounds = this.positionBounds;
        if (!content || !viewport) {
            return;
        }
        const height = (viewportSize.height = viewport.offsetHeight);
        const width = (viewportSize.width = viewport.offsetWidth);
        bounds.xMin = 0;
        bounds.xMax = content.scrollWidth - width;
        bounds.yMin = 0;
        bounds.yMax = content.scrollHeight - height;
        if (useContentMargins) {
            const style = window.getComputedStyle(content);
            bounds.xMax +=
                parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            bounds.yMax +=
                parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
    }
    onResize() {
        stop(this);
        this.position = this.clampPosition(this.position);
    }
}
__decorate([
    property({ param: { type: 'element' } })
], Scroller.prototype, "content", void 0);
__decorate([
    property()
], Scroller.prototype, "items", null);
__decorate([
    property({ param: { defaultValue: '> *', type: 'string' } })
], Scroller.prototype, "itemSelector", void 0);
__decorate([
    property({ param: { defaultValue: true, type: 'bool' } })
], Scroller.prototype, "useContentMargins", void 0);
__decorate([
    property({ param: { defaultValue: ':scope', type: 'element' } })
], Scroller.prototype, "viewport", void 0);
__decorate([
    update({ mode: 'read', events: ['resize', 'update'] })
], Scroller.prototype, "onMeasure", null);
__decorate([
    update({ mode: 'write', events: 'resize' })
], Scroller.prototype, "onResize", null);
