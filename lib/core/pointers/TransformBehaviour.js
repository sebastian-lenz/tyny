import { isNumber } from '../../utils/lang/number/isNumber';
import { PointerBehaviour, } from './PointerBehaviour';
export class TransformBehaviour extends PointerBehaviour {
    constructor() {
        super(...arguments);
        this.minPointers = 1;
        this.isActive = false;
    }
    onTransform(event, pointer) {
        return true;
    }
    onTransformBegin(event, pointer) {
        return true;
    }
    onTransformEnd(event, pointer) { }
    onAdd(event, pointer) {
        const { isActive: _isActive, maxPointers, minPointers } = this;
        const numPointers = this.pointers.length + 1;
        if (isNumber(maxPointers) && numPointers >= maxPointers) {
            return false;
        }
        else if (_isActive || numPointers < minPointers) {
            return true;
        }
        return (this.isActive = this.onTransformBegin(event, pointer));
    }
    onChanged(event, pointer) {
        this.onMove(event, pointer);
    }
    onMove(event, pointer) {
        if (this.isActive && this.onTransform(event, pointer)) {
            return true;
        }
        else {
            this.removeAllPointers();
            return false;
        }
    }
    onRemove(event, pointer) {
        const { isActive: _isActive, minPointers, pointers } = this;
        const numPointers = pointers.length - 1;
        if (_isActive && numPointers < minPointers) {
            this.onTransformEnd(event, pointer);
            this.isActive = false;
        }
    }
}
