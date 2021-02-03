import { SpringTimeline } from './timelines/SpringTimeline';
import { toTimelineValues } from './utils/toTimelineValues';
import { timelineAnimation, } from './utils/timelineAnimation';
function spring(context, properties, options) {
    if (options === void 0) { options = {}; }
    var safeOptions = Object.assign({}, spring.defaultOptions, options);
    var extraProps = function (timelines) { return ({
        advance: function (toProperties) {
            return Object.keys(properties).reduce(function (success, property) {
                var timeline = timelines.find(function (t) { return t.property === property; });
                if (!timeline) {
                    throw new Error("Cannot advance spring, unknown property '" + property + "'.");
                }
                var result = timeline.advance(toProperties[property]);
                return result && success;
            }, true);
        },
    }); };
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
