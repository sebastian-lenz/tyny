import { animation, onAnimationEnd } from '../utils/env/animationProps';
function animate(element, name, options = {}) {
    const defaults = animate.defaultOptions;
    const { duration = defaults.duration, delay = defaults.delay, timingFunction = defaults.timingFunction, fillMode = defaults.fillMode, } = options;
    return new Promise((resolve) => {
        const style = element.style;
        const value = `${name} ${duration}ms ${timingFunction} ${delay}ms ${fillMode}`;
        const handleAnimationEnd = (event) => {
            if (event && event.target !== element)
                return;
            element.removeEventListener(onAnimationEnd, handleAnimationEnd);
            clearTimeout(timeout);
            style[animation] = '';
            resolve();
        };
        const timeout = setTimeout(handleAnimationEnd, duration + delay + 100);
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
