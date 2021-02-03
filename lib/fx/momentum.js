import { easeOutExpo } from './easings/easeOutExpo';
import { MomentumTimeline } from './timelines/MomentumTimeline';
import { timelineAnimation, } from './utils/timelineAnimation';
import { toMomentumValues, } from './utils/toMomentumValues';
function momentum(context, properties, options = {}) {
    const safeOptions = Object.assign({}, momentum.defaultOptions, options);
    return timelineAnimation(context, toMomentumValues(properties), safeOptions, MomentumTimeline, () => ({}));
}
(function (momentum) {
    momentum.defaultOptions = {
        friction: 0.95,
        deceleration: 0.05,
        epsilon: 0.05,
        bounceDuration: 1000,
        bounceEasing: easeOutExpo,
    };
})(momentum || (momentum = {}));
export { momentum };
