import { animation, onAnimationEnd } from '../utils/env/animationProps';
function animate(element, name, options) {
    if (options === void 0) { options = {}; }
    var defaults = animate.defaultOptions;
    var _a = options.duration, duration = _a === void 0 ? defaults.duration : _a, _b = options.delay, delay = _b === void 0 ? defaults.delay : _b, _c = options.timingFunction, timingFunction = _c === void 0 ? defaults.timingFunction : _c, _d = options.fillMode, fillMode = _d === void 0 ? defaults.fillMode : _d;
    return new Promise(function (resolve) {
        var style = element.style;
        var value = name + " " + duration + "ms " + timingFunction + " " + delay + "ms " + fillMode;
        var handleAnimationEnd = function (event) {
            if (event && event.target !== element)
                return;
            element.removeEventListener(onAnimationEnd, handleAnimationEnd);
            clearTimeout(timeout);
            style[animation] = '';
            resolve();
        };
        var timeout = setTimeout(handleAnimationEnd, duration + delay + 100);
        element.addEventListener(onAnimationEnd, handleAnimationEnd);
        style[animation] = value;
    });
}
(function (animate) {
    animate.defaultOptions = {
        delay: 0,
        duration: 400,
        timingFunction: 'ease-in-out',
        fillMode: 'both',
    };
})(animate || (animate = {}));
export { animate };
