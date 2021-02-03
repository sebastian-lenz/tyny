import { Animation } from './index';
import { PropertyMap } from './utils/propertyMap';
import { ValueTypeSource } from './timelines/valueTypes/index';

import SpringTimeline from './timelines/SpringTimeline';

import toTimelineValues, { FromToValuesMap } from './utils/toTimelineValues';
import timelineAnimation, {
  TimelineAnimationOptions,
} from './utils/timelineAnimation';

export interface Spring extends Animation<void> {
  advance(properties: PropertyMap<ValueTypeSource>): boolean;
}

export interface SpringOptions extends TimelineAnimationOptions {
  acceleration: number;
  epsilon: number;
  friction: number;
}

function spring(
  context: any,
  properties: FromToValuesMap,
  options: Partial<SpringOptions> = {}
): Spring {
  const safeOptions = Object.assign({}, spring.defaultOptions, options);
  const extraProps = (timelines: SpringTimeline[]) => ({
    advance: (toProperties: PropertyMap<ValueTypeSource>): boolean => {
      return Object.keys(properties).reduce((success, property) => {
        const timeline = timelines.find(t => t.property === property);
        if (!timeline) {
          throw new Error(
            `Cannot advance spring, unknown property '${property}'.`
          );
        }

        const result = timeline.advance(toProperties[property]);
        return result && success;
      }, true);
    },
  });

  return timelineAnimation(
    context,
    toTimelineValues(properties),
    safeOptions,
    SpringTimeline,
    extraProps
  );
}

namespace spring {
  export const defaultOptions: SpringOptions = {
    acceleration: 0.1,
    epsilon: 0.1,
    friction: 0.4,
  };
}

export default spring;
