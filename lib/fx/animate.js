import { animation, onAnimationEnd, onAnimationStart, } from '../utils/env/animationProps';
function animate(element, name, options = {}) {
    const defaults = animate.defaultOptions;
    const { delay = defaults.delay, direction = defaults.direction, duration = defaults.duration, fillMode = defaults.fillMode, timingFunction = defaults.timingFunction, } = options;
    return new Promise((resolve) => {
        const style = element.style;
        const value = `${name} ${duration}ms ${timingFunction} ${delay}ms ${direction} ${fillMode}`;
        let timeout = 0;
        function handleAnimationEnd(event) {
            if (event && event.target !== element)
                return;
            element.removeEventListener(onAnimationEnd, handleAnimationEnd);
            element.removeEventListener(onAnimationStart, handleAnimationStart);
            style[animation] = '';
            clearTimeout(timeout);
            resolve();
        }
        function handleAnimationStart(event) {
            if (event.target !== element)
                return;
            startTimeout(100);
        }
        function startTimeout(extraTime) {
            if (timeout)
                window.clearTimeout(timeout);
            timeout = window.setTimeout(handleAnimationEnd, duration + delay + extraTime);
        }
        startTimeout(500);
        element.addEventListener(onAnimationEnd, handleAnimationEnd);
        element.addEventListener(onAnimationStart, handleAnimationStart);
        style[animation] = value;
    });
}
(function (animate) {
    animate.defaultOptions = {
        delay: 0,
        direction: 'normal',
        duration: 400,
        timingFunction: 'ease-in-out',
        fillMode: 'both',
    };
})(animate || (animate = {}));
export { animate };
