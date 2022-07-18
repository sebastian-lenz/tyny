import { ClickBehaviour } from '../../core/pointers/ClickBehaviour';
import { easeOutExpo } from '../../fx/easings/easeOutExpo';
import { momentum } from '../../fx/momentum';
import { stop } from '../../fx/dispatcher';
import { TransformBehaviour } from '../../core/pointers/TransformBehaviour';
import { tween } from '../../fx/tween';
export class ZoomBehaviour extends TransformBehaviour {
    constructor() {
        super(...arguments);
        this.allowMoveX = true;
        this.allowMoveY = true;
        this.allowScale = true;
        this.initialPosition = { x: 0, y: 0 };
        this.initialScale = 0;
        this.isActive = false;
    }
    didTransformChange(positionEpsilon = 2, scaleEpsilon = 0.001) {
        const { initialPosition, initialScale, view } = this;
        return (Math.abs(initialPosition.x - view.position.x) > positionEpsilon ||
            Math.abs(initialPosition.y - view.position.y) > positionEpsilon ||
            Math.abs(initialScale - view.scale) > scaleEpsilon);
    }
    onTransformBegin(event, pointer) {
        const { view } = this;
        const { position: { x, y }, scale, } = view;
        this.initialPosition = { x, y };
        this.initialScale = scale;
        stop(view);
        return true;
    }
    onTransform(event, pointer) {
        const { center, initialPosition, initialScale, transform, view } = this;
        const { max, min } = view.getScaleBounds();
        let scale = initialScale;
        if (this.allowScale)
            scale *= transform.scale;
        if (!isFinite(scale))
            scale = initialScale;
        if (scale < min)
            scale = min + (scale - min) * 0.25;
        if (scale > max)
            scale = max + (scale - max) * 0.25;
        const { xMax, xMin, yMax, yMin } = view.getPositionBounds(scale);
        const { left, top } = view.el.getBoundingClientRect();
        let x = center.x - left;
        let y = center.y - top;
        x += ((initialPosition.x - x) / initialScale) * scale;
        y += ((initialPosition.y - y) / initialScale) * scale;
        if (this.allowMoveX)
            x += transform.x;
        if (this.allowMoveY)
            y += transform.y;
        if (x < xMin)
            x = xMin + (x - xMin) * 0.5;
        if (x > xMax)
            x = xMax + (x - xMax) * 0.5;
        if (y < yMin)
            y = yMin + (y - yMin) * 0.5;
        if (y > yMax)
            y = yMax + (y - yMax) * 0.5;
        view.setPosition({ x, y });
        view.setScale(scale);
        return true;
    }
    onTransformEnd(event, pointer) {
        const { view } = this;
        const { position, scale: initialScale } = view;
        const scale = view.limitScale(initialScale);
        if (!this.didTransformChange()) {
            return;
        }
        else {
            ClickBehaviour.tryPreventNextClick(view);
        }
        if (this.pointers.length > 1) {
            const { left, top } = view.el.getBoundingClientRect();
            const center = this.center;
            let x = center.x - left;
            let y = center.y - top;
            x += ((position.x - x) / initialScale) * scale;
            y += ((position.y - y) / initialScale) * scale;
            tween(view, {
                position: view.limitPosition({ x, y }, scale),
                scale,
            }, {
                easing: easeOutExpo,
            });
        }
        else {
            const bounds = view.getPositionBounds(scale);
            const velocity = this.velocity.get();
            if (!this.allowMoveX)
                velocity.x = 0;
            if (!this.allowMoveY)
                velocity.y = 0;
            momentum(view, {
                position: {
                    velocity: { x: velocity.x, y: velocity.y },
                    max: { x: bounds.xMax, y: bounds.yMax },
                    min: { x: bounds.xMin, y: bounds.yMin },
                },
            });
        }
    }
}
