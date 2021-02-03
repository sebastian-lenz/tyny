import { __decorate, __extends } from "tslib";
import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { property } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import { AbstractNumeration, } from './AbstractNumeration';
export var numerationChangeEvent = 'tyny:numerationChange';
var Numeration = /** @class */ (function (_super) {
    __extends(Numeration, _super);
    function Numeration(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._targetListeners = null;
        var _a = options.ignoreUndecided, ignoreUndecided = _a === void 0 ? true : _a;
        _this.ignoreUndecided = ignoreUndecided;
        return _this;
    }
    Object.defineProperty(Numeration.prototype, "target", {
        get: function () {
            var target = this.params.read({ name: 'target' });
            if (target instanceof CycleableView) {
                return target;
            }
            else if (isString(target)) {
                return this.findView(target, CycleableView);
            }
            else {
                return null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Numeration.prototype.onCurrentChanged = function () {
        var _a = this, ignoreUndecided = _a.ignoreUndecided, target = _a.target;
        if (!target) {
            return;
        }
        var currentIndex = target.currentIndex;
        if (ignoreUndecided && currentIndex === -1) {
            return;
        }
        this.setSelectedIndex(currentIndex);
    };
    Numeration.prototype.onLengthChanged = function () {
        var target = this.target;
        if (target) {
            this.setLength(target.length);
        }
    };
    Numeration.prototype.onTargetChanged = function (target) {
        var _targetListeners = this._targetListeners;
        if (_targetListeners) {
            _targetListeners.forEach(function (off) { return off(); });
        }
        if (target) {
            var el = target.el;
            this._targetListeners = [
                on(el, collectionChangedEvent, this.onLengthChanged, { scope: this }),
                on(el, transistEvent, this.onCurrentChanged, { scope: this }),
            ];
            this.setLength(target.length);
            this.setSelectedIndex(target.currentIndex);
        }
    };
    Numeration.prototype.selectIndex = function (index) {
        var target = this.target;
        if (target) {
            target.currentIndex = index;
        }
        else {
            this.trigger(numerationChangeEvent, {
                index: index,
                target: this,
            });
        }
    };
    __decorate([
        property({ immediate: true, watch: 'onTargetChanged' })
    ], Numeration.prototype, "target", null);
    return Numeration;
}(AbstractNumeration));
export { Numeration };
