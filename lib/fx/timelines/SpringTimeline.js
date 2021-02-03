import { __extends } from "tslib";
import { Timeline } from './Timeline';
var SpringTimeline = /** @class */ (function (_super) {
    __extends(SpringTimeline, _super);
    function SpringTimeline(options) {
        var _this = _super.call(this, options) || this;
        var valueType = _this.valueType;
        var acceleration = options.acceleration, epsilon = options.epsilon, friction = options.friction;
        _this.acceleration = acceleration;
        _this.epsilon = epsilon;
        _this.friction = friction;
        _this.targetValue = valueType.clone(options.targetValue);
        _this.velocity = valueType.origin();
        return _this;
    }
    SpringTimeline.prototype.advance = function (to) {
        var _a = this, playState = _a.playState, valueType = _a.valueType;
        if (playState !== 'playing') {
            return false;
        }
        this.targetValue = valueType.clone(to);
        return true;
    };
    SpringTimeline.prototype.update = function (timeStep) {
        var _a = this, targetValue = _a.targetValue, velocity = _a.velocity;
        var _b = this.valueType, add = _b.add, length = _b.length, scale = _b.scale, subtract = _b.subtract;
        if (this.playState !== 'playing') {
            return false;
        }
        var currentValue = this.currentValue;
        var change = subtract(targetValue, currentValue);
        var newVelocity = add(scale(velocity, this.friction), scale(change, this.acceleration));
        this.currentValue = add(currentValue, newVelocity);
        this.velocity = newVelocity;
        if (length(newVelocity) < this.epsilon) {
            this.currentValue = targetValue;
            this.handleFinished();
            return false;
        }
        return true;
    };
    return SpringTimeline;
}(Timeline));
export { SpringTimeline };
