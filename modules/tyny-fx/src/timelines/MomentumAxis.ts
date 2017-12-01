import { EasingFunction } from '../index';

export interface MomentumValueOptions {
  bounceDuration: number;
  bounceEasing: EasingFunction;
  deceleration: number;
  epsilon: number;
  friction: number;
  initialValue: number;
  initialVelocity: number;
  maxValue: number | undefined;
  minValue: number | undefined;
}

export interface MomentumValue {
  currentValue(): number;
  update(delta: number): boolean;
}

/**
 * Calculates the momentum of a single axis.
 */
export default class Axis {
  protected bounceDelta: number;
  protected bounceDuration: number;
  protected bounceEasing: EasingFunction;
  protected bounceInitial: number | undefined;
  protected bounceStep: number;
  protected bounceTarget: number;
  protected currentValue: number;
  protected deceleration: number;
  protected epsilon: number;
  protected friction: number;
  protected maxValue: number | undefined;
  protected minValue: number | undefined;
  protected velocity: number;

  constructor(options: MomentumValueOptions) {
    const { initialValue, initialVelocity, ...remaining } = options;

    Object.assign(this, remaining);

    this.currentValue = initialValue;
    this.velocity = initialVelocity;
  }

  getCurrentValue(): number {
    return this.currentValue;
  }

  update(timeStep: number): boolean {
    let { velocity } = this;
    const {
      bounceInitial,
      currentValue,
      deceleration,
      friction,
      maxValue,
      minValue,
    } = this;

    if (bounceInitial != null) {
      const { bounceDelta, bounceDuration, bounceEasing, bounceTarget } = this;
      const bounceStep = (this.bounceStep += timeStep);

      if (bounceStep >= bounceDuration) {
        this.currentValue = bounceTarget;
        return false;
      } else {
        this.currentValue = bounceEasing(
          bounceStep,
          bounceInitial,
          bounceDelta,
          bounceDuration
        );
        return true;
      }
    }

    if (maxValue != null && currentValue > maxValue) {
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

    if (minValue != null && currentValue < minValue) {
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
