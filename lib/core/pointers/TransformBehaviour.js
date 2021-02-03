import { __extends } from "tslib";
import { isNumber } from '../../utils/lang/number/isNumber';
import { PointerBehaviour, } from './PointerBehaviour';
var TransformBehaviour = /** @class */ (function (_super) {
    __extends(TransformBehaviour, _super);
    function TransformBehaviour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minPointers = 1;
        _this.isActive = false;
        return _this;
    }
    // Transform API
    // -------------
    TransformBehaviour.prototype.onTransform = function (event, pointer) {
        return true;
    };
    TransformBehaviour.prototype.onTransformBegin = function (event, pointer) {
        return true;
    };
    TransformBehaviour.prototype.onTransformEnd = function (event, pointer) { };
    // Behaviour API
    // -------------
    TransformBehaviour.prototype.onAdd = function (event, pointer) {
        var _a = this, _isActive = _a.isActive, maxPointers = _a.maxPointers, minPointers = _a.minPointers;
        var numPointers = this.pointers.length + 1;
        if (isNumber(maxPointers) && numPointers >= maxPointers) {
            return false;
        }
        else if (_isActive || numPointers < minPointers) {
            return true;
        }
        return (this.isActive = this.onTransformBegin(event, pointer));
    };
    TransformBehaviour.prototype.onChanged = function (event, pointer) {
        if (this.isActive && !this.onTransform(event, pointer)) {
            this.removeAllPointers();
        }
    };
    TransformBehaviour.prototype.onRemove = function (event, pointer) {
        var _a = this, _isActive = _a.isActive, minPointers = _a.minPointers, pointers = _a.pointers;
        var numPointers = pointers.length - 1;
        if (_isActive && numPointers < minPointers) {
            this.onTransformEnd(event, pointer);
            this.isActive = false;
        }
    };
    return TransformBehaviour;
}(PointerBehaviour));
export { TransformBehaviour };
