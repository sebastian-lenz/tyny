import { __assign, __extends, __rest } from "tslib";
import { MomentumAxis } from './MomentumAxis';
import { Timeline } from './Timeline';
var MomentumTimeline = /** @class */ (function (_super) {
    __extends(MomentumTimeline, _super);
    function MomentumTimeline(options) {
        var _this = _super.call(this, options) || this;
        var context = options.context, initialVelocity = options.initialVelocity, maxValue = options.maxValue, minValue = options.minValue, property = options.property, rejectOnStop = options.rejectOnStop, valueOptions = __rest(options, ["context", "initialVelocity", "maxValue", "minValue", "property", "rejectOnStop"]);
        var toArray = _this.valueType.toArray;
        var maxValues = maxValue != undefined ? toArray(maxValue) : undefined;
        var minValues = minValue != undefined ? toArray(minValue) : undefined;
        var velocities = toArray(initialVelocity);
        var axes = toArray(_this.initialValue).map(function (value, index) {
            return new MomentumAxis(__assign(__assign({}, valueOptions), { initialValue: value, initialVelocity: velocities[index], maxValue: maxValues ? maxValues[index] : undefined, minValue: minValues ? minValues[index] : undefined }));
        });
        _this.axes = axes;
        return _this;
    }
    MomentumTimeline.prototype.update = function (timeStep) {
        var _a = this, axes = _a.axes, playState = _a.playState, valueType = _a.valueType;
        if (playState !== 'playing') {
            return false;
        }
        var rawValues = [];
        var active = false;
        for (var index = 0; index < axes.length; index++) {
            var axis = axes[index];
            active = axis.update(timeStep) || active;
            rawValues[index] = axis.getCurrentValue();
        }
        this.currentValue = valueType.fromArray(rawValues);
        if (!active) {
            this.handleFinished();
            return false;
        }
        return true;
    };
    return MomentumTimeline;
}(Timeline));
export { MomentumTimeline };
