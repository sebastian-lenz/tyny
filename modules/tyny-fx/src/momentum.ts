import { Animation, EasingFunction } from './index';
import { PropertyMap } from './utils/propertyMap';
import { ValueTypeSource } from './timelines/valueTypes/index';

import MomentumTimeline from './timelines/MomentumTimeline';

import easeOutExpo from './easings/easeOutExpo';
import timelineAnimation, {
  TimelineAnimationOptions,
} from './utils/timelineAnimation';
import toMomentumValues, {
  FromVelocityValuesMap,
} from './utils/toMomentumValues';

export interface Momentum extends Animation<void> {}

export interface MomentumOptions extends TimelineAnimationOptions {
  /**
   * Duration of animation when bouncing back.
   */
  bounceDuration: number;

  /**
   * The easing function that will be used to create the bounce animation.
   */
  bounceEasing: EasingFunction;

  /**
   * Rate of deceleration when content has overscrolled and is slowing down before bouncing back.
   */
  deceleration: number;

  /**
   * The value difference the momentum should stop at.
   */
  epsilon: number;

  /**
   * The friction applied while decelerating.
   */
  friction: number;
}

function momentum(
  context: any,
  properties: FromVelocityValuesMap,
  options: Partial<MomentumOptions> = {}
): Momentum {
  const safeOptions = Object.assign({}, momentum.defaultOptions, options);
  return timelineAnimation(
    context,
    toMomentumValues(properties),
    safeOptions,
    MomentumTimeline,
    () => ({})
  );
}

namespace momentum {
  export const defaultOptions: MomentumOptions = {
    friction: 0.95,
    deceleration: 0.05,
    epsilon: 0.05,
    bounceDuration: 1000,
    bounceEasing: easeOutExpo,
  };
}

export default momentum;
