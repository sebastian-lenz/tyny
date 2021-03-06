import { MomentumAxis } from './MomentumAxis';
import { MomentumOptions } from '../momentum';
import { Timeline, TimelineOptions } from './Timeline';

export interface MomentumTimelineOptions<TValue>
  extends TimelineOptions<TValue>,
    MomentumOptions {
  initialVelocity: TValue;
  maxValue?: TValue;
  minValue?: TValue;
}

export class MomentumTimeline<TValue> extends Timeline<TValue> {
  protected axes: MomentumAxis[];

  constructor(options: MomentumTimelineOptions<TValue>) {
    super(options);

    const {
      context,
      initialVelocity,
      maxValue,
      minValue,
      property,
      rejectOnStop,
      ...valueOptions
    } = options;

    const { toArray } = this.valueType;
    const maxValues = maxValue != undefined ? toArray(maxValue) : undefined;
    const minValues = minValue != undefined ? toArray(minValue) : undefined;
    const velocities = toArray(initialVelocity);
    const axes = toArray(this.initialValue).map(
      (value, index) =>
        new MomentumAxis({
          ...valueOptions,
          initialValue: value,
          initialVelocity: velocities[index],
          maxValue: maxValues ? maxValues[index] : undefined,
          minValue: minValues ? minValues[index] : undefined,
        })
    );

    this.axes = axes;
  }

  update(timeStep: number): boolean {
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
