import { SpringTimeline } from './timelines/SpringTimeline';
import { toTimelineValues } from './utils/toTimelineValues';
import { timelineAnimation, } from './utils/timelineAnimation';
function spring(context, properties, options = {}) {
    const safeOptions = Object.assign({}, spring.defaultOptions, options);
    const extraProps = (timelines) => ({
        advance: (toProperties) => {
            return Object.keys(properties).reduce((success, property) => {
                const timeline = timelines.find((t) => t.property === property);
                if (!timeline) {
                    throw new Error(`Cannot advance spring, unknown property '${property}'.`);
                }
                const result = timeline.advance(toProperties[property]);
                return result && success;
            }, true);
        },
    });
    return timelineAnimation(context, toTimelineValues(properties), safeOptions, SpringTimeline, extraProps);
}
(function (spring) {
    spring.defaultOptions = {
        acceleration: 0.1,
        epsilon: 0.1,
        friction: 0.4,
    };
})(spring || (spring = {}));
export { spring };
