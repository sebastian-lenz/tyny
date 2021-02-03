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
  protected bounceDelta: number = 0;
  protected bounceDuration: number = 0;
  // prettier-ignore
  protected bounceEasing!: EasingFunction;
  protected bounceInitial: number | undefined = undefined;
  protected bounceStep: number = 0;
  protected bounceTarget: number = 0;
  protected currentValue: number = 0;
  protected deceleration: number = 0;
  protected epsilon: number = 0;
  protected friction: number = 0;
  protected maxValue: number | undefined = undefined;
  protected minValue: number | undefined = undefined;
  protected velocity: number = 0;

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

    if (bounceInitial != undefined) {
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

    if (maxValue != undefined && currentValue > maxValue) {
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

    if (minValue != undefined && currentValue < minValue) {
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
