import director from '../services/director';

import { SpringOptions } from '../spring';
import Timeline, { TimelineOptions } from './Timeline';

export interface SpringTimelineOptions<TValue>
  extends TimelineOptions<TValue>,
    SpringOptions {
  targetValue: TValue;
}

export default class SpringTimeline<TValue = any> extends Timeline<TValue> {
  protected acceleration: number;
  protected epsilon: number;
  protected friction: number;

  protected targetValue: TValue;
  protected velocity: TValue;

  constructor(options: SpringTimelineOptions<TValue>) {
    super(options);

    const { valueType } = this;
    const { acceleration, epsilon, friction } = options;

    this.acceleration = acceleration;
    this.epsilon = epsilon;
    this.friction = friction;
    this.targetValue = valueType.clone(options.targetValue);
    this.velocity = valueType.origin();
  }

  advance(to: TValue): boolean {
    const { playState, valueType } = this;
    if (playState !== 'playing') {
      return false;
    }

    this.targetValue = valueType.clone(to);
    return true;
  }

  update(timeStep: number): boolean {
    const { targetValue, velocity } = this;
    const { add, length, scale, subtract } = this.valueType;

    if (this.playState !== 'playing') {
      return false;
    }

    if (length(velocity) < this.epsilon) {
      this.currentValue = targetValue;
      this.handleFinished();
      return false;
    }

    const { currentValue } = this;
    const change: TValue = subtract(targetValue, currentValue);
    const newVelocity = add(
      scale(velocity, this.friction),
      scale(change, this.acceleration)
    );

    this.currentValue = add(currentValue, newVelocity);
    this.velocity = newVelocity;
    return true;
  }
}
