import { __assign, __extends, __rest } from "tslib";
import { Timeline } from './Timeline';
import { TweenValue } from './TweenValue';
var TweenTimeline = /** @class */ (function (_super) {
    __extends(TweenTimeline, _super);
    function TweenTimeline(options) {
        var _this = _super.call(this, options) || this;
        var _a = _this, initialValue = _a.initialValue, valueType = _a.valueType;
        var rejectOnStop = options.rejectOnStop, context = options.context, property = options.property, tweenOptions = __rest(options, ["rejectOnStop", "context", "property"]);
        _this.baseValue = valueType.origin();
        _this.targetValue = options.targetValue;
        _this.tweenValues = [
            new TweenValue(__assign(__assign({}, tweenOptions), { initialValue: initialValue, valueType: valueType })),
        ];
        return _this;
    }
    TweenTimeline.prototype.advance = function (to, options) {
        var _a = this, playState = _a.playState, targetValue = _a.targetValue, tweenValues = _a.tweenValues, valueType = _a.valueType;
        if (playState !== 'playing') {
            return false;
        }
        var rejectOnStop = options.rejectOnStop, tweenOptions = __rest(options, ["rejectOnStop"]);
        tweenValues.push(new TweenValue(__assign(__assign({}, tweenOptions), { initialValue: valueType.origin(), targetValue: valueType.subtract(to, targetValue), valueType: valueType })));
        this.targetValue = to;
        return true;
    };
    TweenTimeline.prototype.update = function (timeStep) {
        var _a = this, baseValue = _a.baseValue, playState = _a.playState, tweenValues = _a.tweenValues, valueType = _a.valueType;
        var add = valueType.add;
        if (playState !== 'playing') {
            return false;
        }
        var index = 0;
        var currentValue = baseValue;
        while (index < tweenValues.length) {
            var tween = tweenValues[index];
            if (tween.update(timeStep) || index > 0) {
                index += 1;
            }
            else {
                this.baseValue = add(this.baseValue, tween.getCurrentValue());
                tweenValues.shift();
            }
            currentValue = add(currentValue, tween.getCurrentValue());
        }
        var finished = !tweenValues.length;
        if (finished) {
            this.currentValue = this.targetValue;
            this.handleFinished();
            return false;
        }
        this.currentValue = currentValue;
        return true;
    };
    return TweenTimeline;
}(Timeline));
export { TweenTimeline };
