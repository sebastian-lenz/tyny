import { __rest } from "tslib";
import { Timeline } from './Timeline';
import { TweenValue } from './TweenValue';
export class TweenTimeline extends Timeline {
    constructor(options) {
        super(options);
        const { initialValue, valueType } = this;
        const { rejectOnStop, context, property } = options, tweenOptions = __rest(options, ["rejectOnStop", "context", "property"]);
        this.baseValue = valueType.origin();
        this.targetValue = options.targetValue;
        this.tweenValues = [
            new TweenValue(Object.assign(Object.assign({}, tweenOptions), { initialValue, valueType })),
        ];
    }
    advance(to, options) {
        const { playState, targetValue, tweenValues, valueType } = this;
        if (playState !== 'playing') {
            return false;
        }
        const { rejectOnStop } = options, tweenOptions = __rest(options, ["rejectOnStop"]);
        tweenValues.push(new TweenValue(Object.assign(Object.assign({}, tweenOptions), { initialValue: valueType.origin(), targetValue: valueType.subtract(to, targetValue), valueType })));
        this.targetValue = to;
        return true;
    }
    update(timeStep) {
        const { baseValue, playState, tweenValues, valueType } = this;
        const { add } = valueType;
        if (playState !== 'playing') {
            return false;
        }
        let index = 0;
        let currentValue = baseValue;
        while (index < tweenValues.length) {
            const tween = tweenValues[index];
            if (tween.update(timeStep) || index > 0) {
                index += 1;
            }
            else {
                this.baseValue = add(this.baseValue, tween.getCurrentValue());
                tweenValues.shift();
            }
            currentValue = add(currentValue, tween.getCurrentValue());
        }
        const finished = !tweenValues.length;
        if (finished) {
            this.currentValue = this.targetValue;
            this.handleFinished();
            return false;
        }
        this.currentValue = currentValue;
        return true;
    }
}
