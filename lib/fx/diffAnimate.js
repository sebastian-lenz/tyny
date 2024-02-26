import { animate } from './animate';
import { diff } from './diff';
import { noop } from '../utils/lang/function';
import { transistPositions } from './diffPositions';
function onlyVisible(items) {
    return items.filter((item) => item.inViewport);
}
export function transistChanges(diff, options = {}) {
    const { animateOptions, detach, fadeIn = 'fadeIn', fadeOut = 'fadeOut', origin, } = options;
    const created = onlyVisible(diff.created);
    const deleted = onlyVisible(diff.deleted);
    const originRect = origin ? origin.getBoundingClientRect() : null;
    const shiftTop = originRect ? -originRect.top : 0;
    const shiftLeft = originRect ? -originRect.left : 0;
    const animations = [
        ...created.map(({ element }) => animate(element, fadeIn, animateOptions)),
        ...deleted.map(({ element, position }) => {
            const { style } = element;
            style.position = 'absolute';
            style.top = `${position.top + shiftTop}px`;
            style.left = `${position.left + shiftLeft}px`;
            return animate(element, fadeOut, animateOptions).then(() => {
                if (detach) {
                    element.remove();
                }
                else {
                    style.position = '';
                    style.top = '';
                    style.left = '';
                }
            });
        }),
    ];
    return Promise.all(animations).then(noop);
}
export function diffAnimate(initialElements, callback, options = {}) {
    const result = diff(initialElements, callback);
    const promise = Promise.all([
        transistPositions(result, options),
        transistChanges(result, options),
    ]);
    if (options.finished) {
        promise.then(options.finished);
    }
    return result;
}
