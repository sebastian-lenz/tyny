import { Animation, EasingFunction } from './index';
import { PropertyMap } from './utils/propertyMap';
import { FromToValuesMap } from './utils/toTimelineValues';
import { ValueTypeSource } from './timelines/valueTypes/index';
import { TimelineAnimationOptions } from './utils/timelineAnimation';
export interface Tween extends Animation<void> {
    advance(properties: PropertyMap<ValueTypeSource>, options?: Partial<TweenOptions>): boolean;
}
export interface TweenOptions extends TimelineAnimationOptions {
    delay: number;
    duration: number;
    easing: EasingFunction;
}
declare function tween(context: any, properties: FromToValuesMap, options?: Partial<TweenOptions>): Tween;
declare namespace tween {
    const defaultOptions: TweenOptions;
}
export { tween };
