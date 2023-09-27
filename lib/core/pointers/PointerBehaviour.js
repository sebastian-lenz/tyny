import { __decorate } from "tslib";
import { Behaviour } from '../Behaviour';
import { createAdapter } from './adapters';
import { event } from '../decorators';
import { Pointer } from './Pointer';
import { Transform2D } from '../../utils/types/Transform2D';
import { Velocity } from './Velocity';
const createVelocity = () => ({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 0,
});
const toVelocity = (transform) => ({
    x: transform.x,
    y: transform.y,
    rotation: transform.rotation,
    scale: transform.scale,
});
const length = (x, y) => Math.sqrt(x * x + y * y);
export class PointerBehaviour extends Behaviour {
    constructor(view, options = {}) {
        super(view, options);
        this.initialCenter = { x: 0, y: 0 };
        this.initialTransform = Transform2D.identity();
        this.pointers = [];
        this.velocity = new Velocity(createVelocity);
        this.adapter = null;
        this.adapter = createAdapter(options.target || view.el, this);
    }
    get center() {
        const { pointers } = this;
        const weight = pointers.length ? 1 / pointers.length : 0;
        return pointers.reduce((result, pointer) => {
            result.x += pointer.clientX * weight;
            result.y += pointer.clientY * weight;
            return result;
        }, { x: 0, y: 0 });
    }
    get hasPointers() {
        return !!this.pointers.length;
    }
    get transform() {
        const { initialCenter, initialTransform, pointers } = this;
        if (pointers.length === 0) {
            return Transform2D.identity();
        }
        if (pointers.length === 1) {
            const p = pointers[0];
            return Transform2D.translation(p.clientX - p.initialTransformClientX, p.clientY - p.initialTransformClientY).multiply(initialTransform);
        }
        const center = this.center;
        const weight = 1 / pointers.length;
        let scale = 0;
        let rotate = 0;
        pointers.forEach((p) => {
            const aX = p.initialTransformClientX - initialCenter.x;
            const aY = p.initialTransformClientY - initialCenter.y;
            const bX = p.clientX - center.x;
            const bY = p.clientY - center.y;
            scale += (length(bX, bY) / length(aX, aY)) * weight;
            rotate += (Math.atan2(bY, bX) - Math.atan2(aY, aX)) * weight;
        });
        const result = Transform2D.translation(center.x - initialCenter.x, center.y - initialCenter.y).multiply(initialTransform);
        result.rotation += rotate;
        result.scale *= scale;
        return result;
    }
    get usePassiveEvents() {
        return !!(this.adapter && this.adapter.usePassiveEvents);
    }
    addPointer(event, options) {
        const pointer = new Pointer(options);
        if (this.onAdd(event, pointer)) {
            this.commit(event, pointer, () => {
                this.pointers.push(pointer);
            });
        }
    }
    hasPointersOfAdapter(adapter) {
        return this.pointers.some((pointer) => pointer.adapter === adapter);
    }
    removePointer(event, id) {
        const { pointers } = this;
        const index = pointers.findIndex((pointer) => pointer.id === id);
        if (index !== -1) {
            const pointer = pointers[index];
            this.onRemove(event, pointer);
            this.commit(event, pointer, () => {
                pointers.splice(index, 1);
            });
        }
    }
    removeAllPointers() {
        const { pointers } = this;
        while (pointers.length) {
            this.removePointer(undefined, pointers[0].id);
        }
    }
    movePointer(event, id, options) {
        const { pointers } = this;
        const index = pointers.findIndex((pointer) => pointer.id === id);
        if (index !== -1) {
            const pointer = pointers[index];
            pointer.move(options);
            if (this.onMove(event, pointer)) {
                this.velocity.push(toVelocity(this.transform));
            }
            else {
                this.removePointer(event, pointer.id);
            }
        }
    }
    onNativeDragStart(event) {
        event.preventDefault();
    }
    onAdd(event, pointer) {
        return true;
    }
    onChanged(event, pointer) { }
    onMove(event, pointer) {
        return true;
    }
    onRemove(event, pointer) { }
    onDestroyed() {
        super.onDestroyed();
        if (this.adapter) {
            this.adapter.dispose();
            this.adapter = null;
        }
    }
    commit(event, pointer, callback) {
        const { adapter, initialCenter, initialTransform, pointers } = this;
        initialTransform.copyFrom(this.transform);
        callback();
        if (pointers.length) {
            const { center } = this;
            initialCenter.x = center.x;
            initialCenter.y = center.y;
            pointers.forEach((pointer) => {
                pointer.initialTransformClientX = pointer.clientX;
                pointer.initialTransformClientY = pointer.clientY;
            });
        }
        else {
            initialCenter.x = 0;
            initialCenter.y = 0;
            initialTransform.identity();
        }
        this.velocity.push(toVelocity(this.transform));
        if (adapter) {
            adapter.updateTracking();
        }
        this.onChanged(event, pointer);
    }
}
__decorate([
    event({ name: 'dragstart' })
], PointerBehaviour.prototype, "onNativeDragStart", null);
