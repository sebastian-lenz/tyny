import { __extends } from "tslib";
import { clamp } from '../../../utils/lang/number';
import { Effect } from './Effect';
import { transform } from '../../../utils/env/transformProps';
var SlideEffect = /** @class */ (function (_super) {
    __extends(SlideEffect, _super);
    function SlideEffect(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.translation, translation = _c === void 0 ? 'translateX' : _c, _d = _b.useOpacity, useOpacity = _d === void 0 ? true : _d;
        var _this = _super.call(this) || this;
        _this.translation = translation;
        _this.useOpacity = useOpacity;
        return _this;
    }
    SlideEffect.prototype.applyFrom = function (element, value) {
        var _a = this, translation = _a.translation, useOpacity = _a.useOpacity;
        element.style[transform] = translation + "(" + value * -100 + "%)";
        if (useOpacity) {
            element.style.opacity = "" + clamp(1 - value);
        }
    };
    SlideEffect.prototype.applyTo = function (element, value) {
        var _a = this, translation = _a.translation, useOpacity = _a.useOpacity;
        element.style[transform] = translation + "(" + (100 + value * -100) + "%)";
        if (useOpacity) {
            element.style.opacity = "" + clamp(value);
        }
    };
    SlideEffect.prototype.clearElement = function (element) {
        element.style[transform] = '';
        if (this.useOpacity) {
            element.style.opacity = '';
        }
    };
    return SlideEffect;
}(Effect));
export { SlideEffect };
