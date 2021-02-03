import { __extends } from "tslib";
import { PointerBehaviour, } from './PointerBehaviour';
var dragCounter = 0;
function onTouchChange(event) {
    event.preventDefault();
}
var DragBehaviour = /** @class */ (function (_super) {
    __extends(DragBehaviour, _super);
    function DragBehaviour(view, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, view, options) || this;
        _this._watchMode = 'idle';
        var _a = options.direction, direction = _a === void 0 ? 'both' : _a, _b = options.isDisabled, isDisabled = _b === void 0 ? false : _b, _c = options.threshold, threshold = _c === void 0 ? 3 : _c;
        _this.direction = direction;
        _this.isDisabled = isDisabled;
        _this.threshold = threshold;
        return _this;
    }
    // Drag API
    // --------
    DragBehaviour.prototype.onDrag = function (event, pointer) {
        return true;
    };
    DragBehaviour.prototype.onDragBegin = function (event, pointer) {
        return true;
    };
    DragBehaviour.prototype.onDragClick = function (event, pointer) { };
    DragBehaviour.prototype.onDragEnd = function (event, pointer) { };
    // Behaviour API
    // -------------
    DragBehaviour.prototype.onAdd = function () {
        if (this.isDisabled || this._watchMode !== 'idle') {
            return false;
        }
        this._watchMode = 'listening';
        return true;
    };
    DragBehaviour.prototype.onMove = function (event, pointer) {
        var _watchMode = this._watchMode;
        if (event) {
            event.preventDefault();
        }
        if (_watchMode === 'listening') {
            var _a = this, direction = _a.direction, threshold = _a.threshold;
            if (pointer.deltaLength < threshold) {
                return true;
            }
            var _b = pointer.delta, x = _b.x, y = _b.y;
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
    };
    DragBehaviour.prototype.onRemove = function (event, pointer) {
        var _watchMode = this._watchMode;
        this.setWatchMode('idle');
        if (_watchMode === 'draging') {
            this.onDragEnd(event, pointer);
        }
        else if (_watchMode === 'listening') {
            this.onDragClick(event, pointer);
        }
    };
    DragBehaviour.prototype.setWatchMode = function (value) {
        var _watchMode = this._watchMode;
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
    };
    return DragBehaviour;
}(PointerBehaviour));
export { DragBehaviour };
