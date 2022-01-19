import { Animation, EasingFunction } from './index';
import { FromToValuesMap } from './utils/toTimelineValues';
import { TimelineAnimationOptions } from './utils/timelineAnimation';
export interface TweenOptions extends TimelineAnimationOptions {
    delay: number;
    duration: number;
    easing: EasingFunction;
}
declare function tweence(context: any, properties: FromToValuesMap, options?: Partial<TweenOptions>): Animation<void>;
declare namespace tweence {
    const defaultOptions: TweenOptions;
}
export { tweence };
