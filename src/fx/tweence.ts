import { Animation, EasingFunction } from './index';
import { easeInOutQuad } from './easings/easeInOutQuad';
import { getTimeline } from './dispatcher';
import { toTimelineValues, FromToValuesMap } from './utils/toTimelineValues';
import { TweenTimeline } from './timelines/TweenTimeline';

import {
  timelineAnimation,
  TimelineAnimationOptions,
} from './utils/timelineAnimation';

export interface TweenOptions extends TimelineAnimationOptions {
  delay: number;
  duration: number;
  easing: EasingFunction;
}

function isTweenTimelines(value: Array<any>): value is Array<TweenTimeline> {
  return value.every(
    (timeline) =>
      timeline instanceof TweenTimeline && timeline.getPlayState() === 'playing'
  );
}

function tweence(
  context: any,
  properties: FromToValuesMap,
  options: Partial<TweenOptions> = {}
): Animation<void> {
  const values = toTimelineValues(properties);
  const safeOptions = Object.assign({}, tweence.defaultOptions, options);
  const timelines = Object.keys(values).map((name) =>
    getTimeline(context, name)
  );

  if (isTweenTimelines(timelines)) {
    timelines.forEach((timeline) =>
      timeline.advance(values[timeline.property].targetValue, safeOptions)
    );

    const promise = Promise.all(timelines).then(() => {
      return timelines.reduce((props, child) => {
        props[child.property] = child.getCurrentValue();
        return props;
      }, {} as any);
    });

    return Object.assign(promise, {
      stop() {
        timelines.forEach((timeline) => timeline.stop());
      },
    });
  }

  return timelineAnimation(context, values, safeOptions, TweenTimeline);
}

namespace tweence {
  export const defaultOptions: TweenOptions = {
    delay: 0,
    duration: 400,
    easing: easeInOutQuad,
  };
}

export { tweence };
