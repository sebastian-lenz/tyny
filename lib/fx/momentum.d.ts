import { Animation, EasingFunction } from './index';
import { TimelineAnimationOptions } from './utils/timelineAnimation';
import { FromVelocityValuesMap } from './utils/toMomentumValues';
export interface Momentum extends Animation<void> {
}
export interface MomentumOptions extends TimelineAnimationOptions {
    bounceDuration: number;
    bounceEasing: EasingFunction;
    deceleration: number;
    epsilon: number;
    friction: number;
}
declare function momentum(context: any, properties: FromVelocityValuesMap, options?: Partial<MomentumOptions>): Momentum;
declare namespace momentum {
    const defaultOptions: MomentumOptions;
}
export { momentum };
