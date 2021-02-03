import { easeInOutQuad } from './easings/easeInOutQuad';
import { toTimelineValues } from './utils/toTimelineValues';
import { TweenTimeline } from './timelines/TweenTimeline';
import { timelineAnimation, } from './utils/timelineAnimation';
function tween(context, properties, options) {
    if (options === void 0) { options = {}; }
    var safeOptions = Object.assign({}, tween.defaultOptions, options);
    var extraProps = function (timelines) { return ({
        advance: function (toProperties, toOptions) {
            if (toOptions === void 0) { toOptions = {}; }
            var safeToOptions = Object.assign({}, safeOptions, toOptions);
            return Object.keys(properties).reduce(function (success, property) {
                var timeline = timelines.find(function (t) { return t.property === property; });
                if (!timeline) {
                    throw new Error("Cannot advance tween, unknown property '" + property + "'.");
                }
                var result = timeline.advance(toProperties[property], safeToOptions);
                return result && success;
            }, true);
        },
    }); };
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
