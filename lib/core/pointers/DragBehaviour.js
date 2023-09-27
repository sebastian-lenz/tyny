import { PointerBehaviour, } from './PointerBehaviour';
export function toAxis(direction) {
    return direction === 'horizontal' ? 'x' : 'y';
}
export function toDimension(direction) {
    return direction === 'horizontal' ? 'width' : 'height';
}
export class DragBehaviour extends PointerBehaviour {
    constructor(view, options = {}) {
        super(view, options);
        this.watchMode = 'idle';
        const { direction = 'both', isDisabled = false, threshold = 3 } = options;
        this.direction = direction;
        this.isDisabled = isDisabled;
        this.threshold = threshold;
    }
    onDrag(event, pointer) {
        return true;
    }
    onDragBegin(event, pointer) {
        return true;
    }
    onDragClick(event, pointer) { }
    onDragEnd(event, pointer) { }
    onAdd(event, pointer) {
        if (this.isDisabled || this.watchMode !== 'idle') {
            return false;
        }
        this.watchMode = 'listening';
        return true;
    }
    onMove(event, pointer) {
        const { watchMode: _watchMode } = this;
        if (_watchMode === 'listening') {
            const { direction, threshold } = this;
            if (pointer.deltaLength < threshold) {
                return true;
            }
            const { x, y } = pointer.delta;
            if ((direction === 'horizontal' && Math.abs(x) < Math.abs(y)) ||
                (direction === 'vertical' && Math.abs(x) > Math.abs(y)) ||
                !this.onDragBegin(event, pointer)) {
                this.setWatchMode('idle');
                return false;
            }
            pointer.resetInitialPosition();
            this.setWatchMode('draging');
        }
        if (_watchMode === 'draging') {
            if (!this.onDrag(event, pointer)) {
                this.setWatchMode('idle');
                return false;
            }
        }
        return true;
    }
    onRemove(event, pointer) {
        const { watchMode: _watchMode } = this;
        this.setWatchMode('idle');
        if (_watchMode === 'draging') {
            this.onDragEnd(event, pointer);
        }
        else if (_watchMode === 'listening') {
            this.onDragClick(event, pointer);
        }
    }
    setWatchMode(value) {
        const { watchMode: _watchMode } = this;
        if (_watchMode === value)
            return;
        this.watchMode = value;
    }
}
