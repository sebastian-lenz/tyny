import { __rest } from "tslib";
/**
 * Calculates the momentum of a single axis.
 */
var MomentumAxis = /** @class */ (function () {
    function MomentumAxis(options) {
        this.bounceDelta = 0;
        this.bounceDuration = 0;
        this.bounceInitial = undefined;
        this.bounceStep = 0;
        this.bounceTarget = 0;
        this.currentValue = 0;
        this.deceleration = 0;
        this.epsilon = 0;
        this.friction = 0;
        this.maxValue = undefined;
        this.minValue = undefined;
        this.velocity = 0;
        var initialValue = options.initialValue, initialVelocity = options.initialVelocity, remaining = __rest(options, ["initialValue", "initialVelocity"]);
        Object.assign(this, remaining);
        this.currentValue = initialValue;
        this.velocity = initialVelocity;
    }
    MomentumAxis.prototype.getCurrentValue = function () {
        return this.currentValue;
    };
    MomentumAxis.prototype.update = function (timeStep) {
        var velocity = this.velocity;
        var _a = this, bounceInitial = _a.bounceInitial, currentValue = _a.currentValue, deceleration = _a.deceleration, friction = _a.friction, maxValue = _a.maxValue, minValue = _a.minValue;
        if (bounceInitial != undefined) {
            var _b = this, bounceDelta = _b.bounceDelta, bounceDuration = _b.bounceDuration, bounceEasing = _b.bounceEasing, bounceTarget = _b.bounceTarget;
            var bounceStep = (this.bounceStep += timeStep);
            if (bounceStep >= bounceDuration) {
                this.currentValue = bounceTarget;
                return false;
            }
            else {
                this.currentValue = bounceEasing(bounceStep, bounceInitial, bounceDelta, bounceDuration);
                return true;
            }
        }
        if (maxValue != undefined && currentValue > maxValue) {
            var excess = maxValue - currentValue;
            if (velocity > 0) {
                velocity = (velocity + excess * deceleration) * friction;
                this.currentValue += velocity;
                this.velocity = velocity;
            }
            if (velocity <= 0) {
                this.bounceInitial = currentValue;
                this.bounceTarget = maxValue;
                this.bounceDelta = excess;
            }
            return true;
        }
        if (minValue != undefined && currentValue < minValue) {
            var excess = minValue - currentValue;
            if (velocity < 0) {
                velocity = (velocity + excess * deceleration) * friction;
                this.currentValue += velocity;
                this.velocity = velocity;
            }
            if (velocity >= 0) {
                this.bounceInitial = currentValue;
                this.bounceTarget = minValue;
                this.bounceDelta = excess;
            }
            return true;
        }
        if (Math.abs(velocity) < this.epsilon) {
            return false;
        }
        velocity *= friction;
        this.currentValue += velocity;
        this.velocity = velocity;
        return true;
    };
    return MomentumAxis;
}());
export { MomentumAxis };
