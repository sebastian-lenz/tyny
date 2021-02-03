import { easeInOutQuad } from './easings/easeInOutQuad';
import { toTimelineValues } from './utils/toTimelineValues';
import { TweenTimeline } from './timelines/TweenTimeline';
import { timelineAnimation, } from './utils/timelineAnimation';
function tween(context, properties, options = {}) {
    const safeOptions = Object.assign({}, tween.defaultOptions, options);
    const extraProps = (timelines) => ({
        advance: (toProperties, toOptions = {}) => {
            const safeToOptions = Object.assign({}, safeOptions, toOptions);
            return Object.keys(properties).reduce((success, property) => {
                const timeline = timelines.find((t) => t.property === property);
                if (!timeline) {
                    throw new Error(`Cannot advance tween, unknown property '${property}'.`);
                }
                const result = timeline.advance(toProperties[property], safeToOptions);
                return result && success;
            }, true);
        },
    });
    return timelineAnimation(context, toTimelineValues(properties), safeOptions, TweenTimeline, extraProps);
}
(function (tween) {
    tween.defaultOptions = {
        delay: 0,
        duration: 400,
        easing: easeInOutQuad,
    };
})(tween || (tween = {}));
export { tween };
