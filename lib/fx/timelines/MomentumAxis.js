import { __rest } from "tslib";
export class MomentumAxis {
    constructor(options) {
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
        const { initialValue, initialVelocity } = options, remaining = __rest(options, ["initialValue", "initialVelocity"]);
        Object.assign(this, remaining);
        this.currentValue = initialValue;
        this.velocity = initialVelocity;
    }
    getCurrentValue() {
        return this.currentValue;
    }
    update(timeStep) {
        let { velocity } = this;
        const { bounceInitial, currentValue, deceleration, friction, maxValue, minValue, } = this;
        if (bounceInitial != undefined) {
            const { bounceDelta, bounceDuration, bounceEasing, bounceTarget } = this;
            const bounceStep = (this.bounceStep += timeStep);
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
            const excess = maxValue - currentValue;
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
            const excess = minValue - currentValue;
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
    }
}
