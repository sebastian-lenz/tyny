import { ClickBehaviour } from '../../core/pointers/ClickBehaviour';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { on } from '../../utils/dom/event/on';
import { stop } from '../../fx/dispatcher';
import { DragBehaviour } from '../../core/pointers/DragBehaviour';
export class DragScrollBehaviour extends DragBehaviour {
    constructor(view, options) {
        super(view, options);
        this.ignoreWheelAxis = false;
        this.isDraging = false;
        this.listeners = null;
        this.initialPosition = view.position;
        this.ignoreWheelAxis = !!options.ignoreWheelAxis;
        if (!options.disableWheel) {
            this.listeners = [on(view.el, 'wheel', this.onWheel, { scope: this })];
        }
    }
    onDragBegin(event, pointer) {
        const { direction, view } = this;
        stop(view);
        const { xMin, xMax, yMin, yMax } = view.positionBounds;
        const xDiff = Math.max(0, xMax - xMin);
        const yDiff = Math.max(0, yMax - yMin);
        const canScroll = (direction !== 'vertical' && xDiff > 0) ||
            (direction !== 'horizontal' && yDiff > 0);
        if (!canScroll) {
            return false;
        }
        this.isDraging = true;
        this.initialPosition = view.position;
        if (!this.usePassiveEvents) {
            event.preventDefault();
        }
        return true;
    }
    onDrag(event, pointer) {
        const { direction, initialPosition, view } = this;
        if (!this.usePassiveEvents) {
            event.preventDefault();
        }
        const delta = view.toLocalOffset(pointer.delta);
        const { xMin, xMax, yMin, yMax } = view.positionBounds;
        let { x, y } = initialPosition;
        if (direction !== 'vertical') {
            x -= delta.x;
            if (x > xMax)
                x = xMax + (x - xMax) * 0.5;
            if (x < xMin)
                x = xMin + (x - xMin) * 0.5;
        }
        if (direction !== 'horizontal') {
            y -= delta.y;
            if (y > yMax)
                y = yMax + (y - yMax) * 0.5;
            if (y < yMin)
                y = yMin + (y - yMin) * 0.5;
        }
        view.position = { x, y };
        return true;
    }
    onDragEnd(event, pointer) {
        const { view } = this;
        const velocity = this.getVelocity(pointer);
        this.isDraging = false;
        ClickBehaviour.tryPreventNextClick(this.view);
        if (view.isPositionPaged) {
            const position = view.position;
            position.x += velocity.x * 10;
            position.y += velocity.y * 10;
            view.tweenTo(view.clampPosition(position), { easing: easeOutExpo });
        }
        else {
            const { xMin, xMax, yMin, yMax } = view.positionBounds;
            momentum(view, {
                position: {
                    velocity,
                    min: { x: xMin, y: yMin },
                    max: { x: xMax, y: yMax },
                },
            });
        }
    }
    getVelocity(pointer) {
        const { direction, view } = this;
        const { clientX, clientY } = pointer.velocity.get();
        const velocity = { x: 0, y: 0 };
        if (direction !== 'vertical') {
            velocity.x = -clientX;
        }
        if (direction !== 'horizontal') {
            velocity.y = -clientY;
        }
        return view.toLocalOffset(velocity);
    }
    onDestroyed() {
        super.onDestroyed();
        if (this.listeners) {
            this.listeners.forEach((off) => off());
            this.listeners = null;
        }
    }
    onWheel(event) {
        if (this.isDraging || this.isDisabled) {
            return;
        }
        const { direction, view } = this;
        const position = view.position;
        let didUpdate = false;
        const delta = view.toLocalOffset({
            x: event.deltaX,
            y: event.deltaY,
        });
        if (this.ignoreWheelAxis) {
            if (Math.abs(delta.x) > Math.abs(delta.y)) {
                delta.y = delta.x;
            }
            else {
                delta.x = delta.y;
            }
        }
        if (direction !== 'vertical') {
            position.x += delta.x;
            didUpdate = didUpdate || Math.abs(delta.x) > 0;
        }
        if (direction !== 'horizontal') {
            position.y += delta.y;
            didUpdate = didUpdate || Math.abs(delta.y) > 0;
        }
        if (didUpdate) {
            event.preventDefault();
        }
        stop(view);
        view.position = view.clampPosition(position);
    }
}
