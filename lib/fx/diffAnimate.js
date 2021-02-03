import { diffPositions } from './diffPositions';
import { onAnimationEnd } from '../utils/env/animationProps';
/**
 * Animate the changed positions of the given elements, fade in new elements and fade out deleted elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 * @param options   The advanced options used to animate the elements.
 */
export function diffAnimate(initialElements, callback, options) {
    if (options === void 0) { options = {}; }
    var result = diffPositions(initialElements, callback, options);
    var created = result.created, deleted = result.deleted;
    var _a = options.detach, detach = _a === void 0 ? false : _a, origin = options.origin;
    var shiftTop = 0;
    var shiftLeft = 0;
    if (origin) {
        var originRect = origin.getBoundingClientRect();
        shiftTop = -originRect.top;
        shiftLeft = -originRect.left;
    }
    created.forEach(function (_a) {
        var element = _a.element, inViewport = _a.inViewport;
        if (!inViewport)
            return;
        var handleEnd = function () {
            element.classList.remove('fadeIn');
            element.removeEventListener(onAnimationEnd, handleEnd);
        };
        element.addEventListener(onAnimationEnd, handleEnd);
        element.classList.add('fadeIn');
    });
    deleted.forEach(function (_a) {
        var element = _a.element, inViewport = _a.inViewport, position = _a.position;
        if (!inViewport)
            return;
        var style = element.style;
        var handleEnd = function () {
            element.classList.remove('fadeOut');
            style.position = '';
            style.top = '';
            style.left = '';
            element.removeEventListener(onAnimationEnd, handleEnd);
            if (detach && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        };
        element.addEventListener(onAnimationEnd, handleEnd);
        element.classList.add('fadeOut');
        style.position = 'absolute';
        style.top = position.top + shiftTop + "px";
        style.left = position.left + shiftLeft + "px";
    });
    return result;
}
