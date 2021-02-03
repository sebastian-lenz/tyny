var TweenValue = /** @class */ (function () {
    function TweenValue(options) {
        Object.assign(this, options);
        var delay = options.delay, initialValue = options.initialValue, targetValue = options.targetValue, valueType = options.valueType;
        var toArray = valueType.toArray;
        var baseValues = toArray(initialValue);
        var valueChanges = toArray(targetValue).map(function (value, index) { return value - baseValues[index]; });
        this.baseValues = baseValues;
        this.currentValue = initialValue;
        this.time = -delay;
        this.valueChanges = valueChanges;
    }
    TweenValue.prototype.getCurrentValue = function () {
        return this.currentValue;
    };
    TweenValue.prototype.update = function (delta) {
        var duration = this.duration;
        var time = (this.time += delta);
        if (time >= duration) {
            this.currentValue = this.targetValue;
            return false;
        }
        else if (time <= 0) {
            this.currentValue = this.initialValue;
            return true;
        }
        var _a = this, baseValues = _a.baseValues, easing = _a.easing, valueChanges = _a.valueChanges, valueType = _a.valueType;
        this.currentValue = valueType.fromArray(baseValues.map(function (base, index) {
            return easing(time, base, valueChanges[index], duration);
        }));
        return true;
    };
    return TweenValue;
}());
export { TweenValue };
