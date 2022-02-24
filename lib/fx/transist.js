import { withoutTransition } from './withoutTransition';
import { onTransitionCancel, onTransitionEnd, transition, } from '../utils/env/transitionProps';
function transist(element, properties, options = {}) {
    const defaults = transist.defaultOptions;
    const { delay: defaultDelay = defaults.delay, duration: defaultDuration = defaults.duration, timingFunction: defaultTimingFunction = defaults.timingFunction, } = options;
    const style = element.style;
    const clearProps = ['transition'];
    const fromProps = [];
    const toProps = [];
    toProps.push([
        transition,
        Object.keys(properties)
            .map((key) => {
            const property = properties[key];
            let delay = defaultDelay;
            let duration = defaultDuration;
            let timingFunction = defaultTimingFunction;
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
            return `${key} ${duration}ms ${delay}ms ${typeof timingFunction === 'function'
                ? timingFunction.toCSS()
                : timingFunction}`;
        })
            .join(','),
    ]);
    return new Promise((resolve) => {
        let numProperties = toProps.length - 1;
        function handleEnd(event) {
            if (event.target !== element)
                return;
            if ('propertyName' in event && --numProperties > 0)
                return;
            element.removeEventListener(onTransitionEnd, handleEnd);
            element.removeEventListener(onTransitionCancel, handleEnd);
            clearProps.forEach((key) => (style[key] = ''));
            resolve();
        }
        if (fromProps.length) {
            withoutTransition(element, () => {
                fromProps.forEach(([key, value]) => (style[key] = value));
            });
        }
        element.addEventListener(onTransitionEnd, handleEnd);
        element.addEventListener(onTransitionCancel, handleEnd);
        toProps.forEach(([key, value]) => (style[key] = value));
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
