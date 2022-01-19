import { easeInOutQuad } from './easings/easeInOutQuad';
import { getTimeline } from './dispatcher';
import { toTimelineValues } from './utils/toTimelineValues';
import { TweenTimeline } from './timelines/TweenTimeline';
import { timelineAnimation, } from './utils/timelineAnimation';
function isTweenTimelines(value) {
    return value.every((timeline) => timeline instanceof TweenTimeline && timeline.getPlayState() === 'playing');
}
function tweence(context, properties, options = {}) {
    const values = toTimelineValues(properties);
    const safeOptions = Object.assign({}, tweence.defaultOptions, options);
    const timelines = Object.keys(values).map((name) => getTimeline(context, name));
    if (isTweenTimelines(timelines)) {
        timelines.forEach((timeline) => timeline.advance(values[timeline.property].targetValue, safeOptions));
        const promise = Promise.all(timelines).then(() => {
            return timelines.reduce((props, child) => {
                props[child.property] = child.getCurrentValue();
                return props;
            }, {});
        });
        return Object.assign(promise, {
            stop() {
                timelines.forEach((timeline) => timeline.stop());
            },
        });
    }
    return timelineAnimation(context, values, safeOptions, TweenTimeline);
}
(function (tweence) {
    tweence.defaultOptions = {
        delay: 0,
        duration: 400,
        easing: easeInOutQuad,
    };
})(tweence || (tweence = {}));
export { tweence };
