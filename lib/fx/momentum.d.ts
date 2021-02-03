import { Animation, EasingFunction } from './index';
import { TimelineAnimationOptions } from './utils/timelineAnimation';
import { FromVelocityValuesMap } from './utils/toMomentumValues';
export interface Momentum extends Animation<void> {
}
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
declare function momentum(context: any, properties: FromVelocityValuesMap, options?: Partial<MomentumOptions>): Momentum;
declare namespace momentum {
    const defaultOptions: MomentumOptions;
}
export { momentum };
