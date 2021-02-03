import { onTransitionEnd, transition } from '../utils/env/transitionProps';
import { withoutTransition } from './withoutTransition';
function transist(element, properties, options) {
    if (options === void 0) { options = {}; }
    var defaults = transist.defaultOptions;
    var _a = options.delay, defaultDelay = _a === void 0 ? defaults.delay : _a, _b = options.duration, defaultDuration = _b === void 0 ? defaults.duration : _b, _c = options.timingFunction, defaultTimingFunction = _c === void 0 ? defaults.timingFunction : _c;
    var style = element.style;
    var clearProps = ['transition'];
    var fromProps = [];
    var toProps = [];
    toProps.push([
        transition,
        Object.keys(properties)
            .map(function (key) {
            var property = properties[key];
            var delay = defaultDelay;
            var duration = defaultDuration;
            var timingFunction = defaultTimingFunction;
            if (typeof property === 'string') {
                toProps.push([key, property]);
            }
            else {
                if (property.delay)
                    delay = property.delay;
                if (property.duration)
                    duration = property.duration;
                if (property.timingFunction)
                    timingFunction = property.timingFunction;
                if (property.from)
                    fromProps.push([key, property.from]);
                if (property.clear)
                    clearProps.push(key);
                toProps.push([key, property.to]);
            }
            return key + " " + duration + "ms " + delay + "ms " + (typeof timingFunction === 'function'
                ? timingFunction.toCSS()
                : timingFunction);
        })
            .join(','),
    ]);
    return new Promise(function (resolve) {
        var numProperties = toProps.length - 1;
        function handleEnd(event) {
            if (event.target !== element)
                return;
            if ('propertyName' in event && --numProperties > 0)
                return;
            element.removeEventListener(onTransitionEnd, handleEnd);
            clearProps.forEach(function (key) { return (style[key] = ''); });
            resolve();
        }
        if (fromProps.length) {
            withoutTransition(element, function () {
                fromProps.forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    return (style[key] = value);
                });
            });
        }
        element.addEventListener(onTransitionEnd, handleEnd);
        toProps.forEach(function (_a) {
            var key = _a[0], value = _a[1];
            return (style[key] = value);
        });
    });
}
(function (transist) {
    transist.defaultOptions = {
        delay: 0,
        duration: 400,
        timingFunction: 'ease-in-out',
    };
})(transist || (transist = {}));
export { transist };
