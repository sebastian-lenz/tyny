import { __decorate, __extends } from "tslib";
import { Behaviour } from '../../core/Behaviour';
import { event } from '../../core';
import { normalizeWheel } from '../../utils/env/normalizeWheel';
import { onWheel } from '../../utils/env';
import { spring } from '../../fx/spring';
var power = 1;
var WheelBehaviour = /** @class */ (function (_super) {
    __extends(WheelBehaviour, _super);
    function WheelBehaviour() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WheelBehaviour.prototype.handleWheel = function (event) {
        var data = normalizeWheel(event);
        var view = this.view;
        var _a = view.position, currentX = _a.x, currentY = _a.y, currentScale = view.scale;
        var scale = currentScale;
        if (data.spinY < -0.01) {
            scale /= 1 - data.spinY * power;
        }
        else if (data.spinY > 0.01) {
            scale *= 1 + data.spinY * power;
        }
        scale = view.limitScale(scale);
        if (Math.abs(currentScale - scale) < 0.0001) {
            return;
        }
        var _b = view.el.getBoundingClientRect(), left = _b.left, top = _b.top;
        var x = event.clientX - left;
        var y = event.clientY - top;
        x += ((currentX - x) / currentScale) * scale;
        y += ((currentY - y) / currentScale) * scale;
        spring(view, {
            position: view.limitPosition({ x: x, y: y }, scale),
            scale: scale,
        }, {
            epsilon: 0.0001,
        });
    };
    __decorate([
        event({ name: onWheel })
    ], WheelBehaviour.prototype, "handleWheel", null);
    return WheelBehaviour;
}(Behaviour));
export { WheelBehaviour };
