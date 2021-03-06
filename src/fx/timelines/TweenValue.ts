import { EasingFunction } from '../index';
import { ValueType } from '../timelines/valueTypes/index';

export interface TweenValueOptions<TValue> {
  delay: number;
  duration: number;
  easing: EasingFunction;
  initialValue: TValue;
  targetValue: TValue;
  valueType: ValueType<TValue>;
}

export class TweenValue<TValue> {
  protected baseValues: number[];
  protected currentValue: TValue;
  protected delay!: number;
  protected duration!: number;
  protected easing!: EasingFunction;
  protected initialValue!: TValue;
  protected targetValue!: TValue;
  protected time: number;
  protected valueChanges: number[];
  protected valueType!: ValueType<TValue>;

  constructor(options: TweenValueOptions<TValue>) {
    Object.assign(this, options);
    const { delay, initialValue, targetValue, valueType } = options;
    const { toArray } = valueType;
    const baseValues = toArray(initialValue);
    const valueChanges = toArray(targetValue).map(
      (value, index) => value - baseValues[index]
    );

    this.baseValues = baseValues;
    this.currentValue = initialValue;
    this.time = -delay;
    this.valueChanges = valueChanges;
  }

  getCurrentValue(): TValue {
    return this.currentValue;
  }

  update(delta: number): boolean {
    const { duration } = this;
    const time = (this.time += delta);

    if (time >= duration) {
      this.currentValue = this.targetValue;
      return false;
    } else if (time <= 0) {
      this.currentValue = this.initialValue;
      return true;
    }

    const { baseValues, easing, valueChanges, valueType } = this;
    this.currentValue = valueType.fromArray(
      baseValues.map((base, index) =>
        easing(time, base, valueChanges[index], duration)
      )
    );

    return true;
  }
}
