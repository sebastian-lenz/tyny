import { TweenOptions } from '../tween';
import Timeline, { TimelineOptions } from './Timeline';
import TweenValue from './TweenValue';

export interface TweenTimelineOptions<TValue>
  extends TimelineOptions<TValue>,
    TweenOptions {
  targetValue: TValue;
}

export default class TweenTimeline<TValue = any> extends Timeline<TValue> {
  protected baseValue: TValue;
  protected tweenValues: TweenValue<TValue>[];
  protected targetValue: TValue;

  constructor(options: TweenTimelineOptions<TValue>) {
    super(options);

    const { initialValue, valueType } = this;
    const { context, property, ...tweenOptions } = options;

    this.baseValue = valueType.origin();
    this.targetValue = options.targetValue;
    this.tweenValues = [
      new TweenValue({ ...tweenOptions, initialValue, valueType }),
    ];
  }

  advance(to: TValue, options: TweenOptions): boolean {
    const { playState, targetValue, tweenValues, valueType } = this;
    if (playState !== 'playing') {
      return false;
    }

    tweenValues.push(
      new TweenValue({
        ...options,
        initialValue: valueType.origin(),
        targetValue: valueType.subtract(to, targetValue),
        valueType,
      })
    );

    this.targetValue = to;
    return true;
  }

  update(timeStep: number): boolean {
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
      } else {
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

    return true;
  }
}
