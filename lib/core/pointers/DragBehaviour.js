import { PointerBehaviour, } from './PointerBehaviour';
let dragCounter = 0;
function onTouchChange(event) {
    event.preventDefault();
}
export class DragBehaviour extends PointerBehaviour {
    constructor(view, options = {}) {
        super(view, options);
        this._watchMode = 'idle';
        const { direction = 'both', isDisabled = false, threshold = 3 } = options;
        this.direction = direction;
        this.isDisabled = isDisabled;
        this.threshold = threshold;
    }
    // Drag API
    // --------
    onDrag(event, pointer) {
        return true;
    }
    onDragBegin(event, pointer) {
        return true;
    }
    onDragClick(event, pointer) { }
    onDragEnd(event, pointer) { }
    // Behaviour API
    // -------------
    onAdd() {
        if (this.isDisabled || this._watchMode !== 'idle') {
            return false;
        }
        this._watchMode = 'listening';
        return true;
    }
    onMove(event, pointer) {
        const { _watchMode } = this;
        if (event) {
            event.preventDefault();
        }
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
        const { _watchMode } = this;
        this.setWatchMode('idle');
        if (_watchMode === 'draging') {
            this.onDragEnd(event, pointer);
        }
        else if (_watchMode === 'listening') {
            this.onDragClick(event, pointer);
        }
    }
    setWatchMode(value) {
        const { _watchMode } = this;
        if (_watchMode === value)
            return;
        this._watchMode = value;
        if (value === 'draging') {
            dragCounter += 1;
            if (dragCounter == 1) {
                document.addEventListener('touchforcechange', onTouchChange, {
                    passive: false,
                });
            }
        }
        else if (_watchMode === 'draging') {
            dragCounter -= 1;
            if (dragCounter == 0) {
                document.removeEventListener('touchforcechange', onTouchChange);
            }
        }
    }
}
