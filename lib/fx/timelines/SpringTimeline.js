import { Timeline } from './Timeline';
export class SpringTimeline extends Timeline {
    constructor(options) {
        super(options);
        const { valueType } = this;
        const { acceleration, epsilon, friction } = options;
        this.acceleration = acceleration;
        this.epsilon = epsilon;
        this.friction = friction;
        this.targetValue = valueType.clone(options.targetValue);
        this.velocity = valueType.origin();
    }
    advance(to) {
        const { playState, valueType } = this;
        if (playState !== 'playing') {
            return false;
        }
        this.targetValue = valueType.clone(to);
        return true;
    }
    update(timeStep) {
        const { targetValue, velocity } = this;
        const { add, length, scale, subtract } = this.valueType;
        if (this.playState !== 'playing') {
            return false;
        }
        const { currentValue } = this;
        const change = subtract(targetValue, currentValue);
        const newVelocity = add(scale(velocity, this.friction), scale(change, this.acceleration));
        this.currentValue = add(currentValue, newVelocity);
        this.velocity = newVelocity;
        if (length(newVelocity) < this.epsilon) {
            this.currentValue = targetValue;
            this.handleFinished();
            return false;
        }
        return true;
    }
}
