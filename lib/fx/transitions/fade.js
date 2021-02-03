import { __assign } from "tslib";
import { animate } from '../animate';
import { fadeIn } from './keyframes/fadeIn';
import { fadeOut } from './keyframes/fadeOut';
export function fade(options) {
    if (options === void 0) { options = {}; }
    var merged = __assign(__assign({}, animate.defaultOptions), options);
    return function (from, to) {
        if (from && to) {
            var delay = merged.delay, duration = merged.duration;
            return Promise.all([
                animate(from, fadeOut(), __assign(__assign({}, merged), { delay: 0, duration: duration * 0.5 })).then(function () {
                    from.style.visibility = 'hidden';
                }),
                animate(to, fadeIn(), __assign(__assign({}, merged), { delay: duration * 0.5 + delay, duration: duration * 0.5 })),
            ]).then(function () {
                from.style.visibility = '';
                return undefined;
            });
        }
        if (to) {
            return animate(to, fadeIn(), merged);
        }
        if (from) {
            return animate(from, fadeOut(), merged);
        }
        return Promise.resolve();
    };
}
