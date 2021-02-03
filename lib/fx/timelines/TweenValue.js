export class TweenValue {
    constructor(options) {
        Object.assign(this, options);
        const { delay, initialValue, targetValue, valueType } = options;
        const { toArray } = valueType;
        const baseValues = toArray(initialValue);
        const valueChanges = toArray(targetValue).map((value, index) => value - baseValues[index]);
        this.baseValues = baseValues;
        this.currentValue = initialValue;
        this.time = -delay;
        this.valueChanges = valueChanges;
    }
    getCurrentValue() {
        return this.currentValue;
    }
    update(delta) {
        const { duration } = this;
        const time = (this.time += delta);
        if (time >= duration) {
            this.currentValue = this.targetValue;
            return false;
        }
        else if (time <= 0) {
            this.currentValue = this.initialValue;
            return true;
        }
        const { baseValues, easing, valueChanges, valueType } = this;
        this.currentValue = valueType.fromArray(baseValues.map((base, index) => easing(time, base, valueChanges[index], duration)));
        return true;
    }
}
