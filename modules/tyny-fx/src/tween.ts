import easeInOutQuad from './easings/easeInOutQuad';

import { Animation, EasingFunction } from './index';
import { PropertyMap } from './utils/propertyMap';
import { ValueTypeSource } from './timelines/valueTypes/index';

import TweenTimeline from './timelines/TweenTimeline';

import toTimelineValues, { FromToValuesMap } from './utils/toTimelineValues';
import timelineAnimation, {
  TimelineAnimationOptions,
} from './utils/timelineAnimation';

export interface Tween extends Animation<void> {
  advance(
    properties: PropertyMap<ValueTypeSource>,
    options?: Partial<TweenOptions>
  ): boolean;
}

export interface TweenOptions extends TimelineAnimationOptions {
  delay: number;
  duration: number;
  easing: EasingFunction;
}

function tween(
  context: any,
  properties: FromToValuesMap,
  options: Partial<TweenOptions> = {}
): Tween {
  const safeOptions = Object.assign({}, tween.defaultOptions, options);
  const extraProps = (timelines: TweenTimeline[]) => ({
    advance: (
      toProperties: PropertyMap<ValueTypeSource>,
      toOptions: Partial<TweenOptions> = {}
    ): boolean => {
      const safeToOptions = Object.assign({}, safeOptions, toOptions);

      return Object.keys(properties).reduce((success, property) => {
        const timeline = timelines.find(t => t.property === property);
        if (!timeline) {
          throw new Error(
            `Cannot advance tween, unknown property '${property}'.`
          );
        }

        const result = timeline.advance(toProperties[property], safeToOptions);
        return result && success;
      }, true);
    },
  });

  return timelineAnimation(
    context,
    toTimelineValues(properties),
    safeOptions,
    TweenTimeline,
    extraProps
  );
}

namespace tween {
  export const defaultOptions: TweenOptions = {
    delay: 0,
    duration: 500,
    easing: easeInOutQuad,
  };
}

export default tween;
