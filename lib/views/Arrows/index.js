import { __decorate, __extends } from "tslib";
import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { event, property, View } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
var buttonParam = function (name) { return ({
    className: process.env.TYNY_PREFIX + "Arrows--button " + name,
    defaultValue: "button." + name,
    tagName: 'button',
    type: 'element',
}); };
var Arrows = /** @class */ (function (_super) {
    __extends(Arrows, _super);
    function Arrows() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.stopListening = null;
        return _this;
    }
    Object.defineProperty(Arrows.prototype, "target", {
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
    Arrows.prototype.navigateBy = function (step) {
        var target = this.target;
        if (target) {
            target.currentIndex += step;
        }
    };
    Arrows.prototype.onChanged = function () {
        var _a = this, el = _a.el, target = _a.target;
        el.classList.toggle('disabled', !target || target.length < 2);
    };
    Arrows.prototype.onClick = function (event) {
        var _a = this, backward = _a.backward, forward = _a.forward;
        var target = event.target;
        while (target) {
            if (target === backward) {
                return this.navigateBy(-1);
            }
            else if (target === forward) {
                return this.navigateBy(1);
            }
            target = target.parentElement;
        }
    };
    Arrows.prototype.onTargetChanged = function () {
        var _a = this, stopListening = _a.stopListening, target = _a.target;
        if (stopListening) {
            stopListening.forEach(function (off) { return off(); });
        }
        if (target) {
            var el = target.el;
            var options = { scope: this };
            this.onChanged();
            this.stopListening = [
                on(el, collectionChangedEvent, this.onChanged, options),
                on(el, transistEvent, this.onTransist, options),
            ];
        }
        else {
            this.stopListening = null;
        }
    };
    Arrows.prototype.onTransist = function () {
        var _a = this, backward = _a.backward, forward = _a.forward, target = _a.target;
        if (!target || target.isLooped) {
            return;
        }
        var index = target.currentIndex;
        backward.disabled = index <= 0;
        forward.disabled = index >= target.length - 1;
    };
    __decorate([
        property({ param: buttonParam('backward') })
    ], Arrows.prototype, "backward", void 0);
    __decorate([
        property({ param: buttonParam('forward') })
    ], Arrows.prototype, "forward", void 0);
    __decorate([
        property({ immediate: true, watch: 'onTargetChanged' })
    ], Arrows.prototype, "target", null);
    __decorate([
        event({ name: 'click' })
    ], Arrows.prototype, "onClick", null);
    return Arrows;
}(View));
export { Arrows };
