import { __rest } from "tslib";
import { MomentumAxis } from './MomentumAxis';
import { Timeline } from './Timeline';
export class MomentumTimeline extends Timeline {
    constructor(options) {
        super(options);
        const { context, initialVelocity, maxValue, minValue, property, rejectOnStop } = options, valueOptions = __rest(options, ["context", "initialVelocity", "maxValue", "minValue", "property", "rejectOnStop"]);
        const { toArray } = this.valueType;
        const maxValues = maxValue != undefined ? toArray(maxValue) : undefined;
        const minValues = minValue != undefined ? toArray(minValue) : undefined;
        const velocities = toArray(initialVelocity);
        const axes = toArray(this.initialValue).map((value, index) => new MomentumAxis(Object.assign(Object.assign({}, valueOptions), { initialValue: value, initialVelocity: velocities[index], maxValue: maxValues ? maxValues[index] : undefined, minValue: minValues ? minValues[index] : undefined })));
        this.axes = axes;
    }
    update(timeStep) {
        const { axes, playState, valueType } = this;
        if (playState !== 'playing') {
            return false;
        }
        const rawValues = [];
        let active = false;
        for (let index = 0; index < axes.length; index++) {
            const axis = axes[index];
            active = axis.update(timeStep) || active;
            rawValues[index] = axis.getCurrentValue();
        }
        this.currentValue = valueType.fromArray(rawValues);
        if (!active) {
            this.handleFinished();
            return false;
        }
        return true;
    }
}
