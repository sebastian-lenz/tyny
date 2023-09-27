import { diffPositions } from './diffPositions';
import { onAnimationEnd } from '../utils/env/animationProps';
export function diffAnimate(initialElements, callback, options = {}) {
    const result = diffPositions(initialElements, callback, options);
    const { created, deleted } = result;
    const { detach = false, origin } = options;
    let shiftTop = 0;
    let shiftLeft = 0;
    if (origin) {
        const originRect = origin.getBoundingClientRect();
        shiftTop = -originRect.top;
        shiftLeft = -originRect.left;
    }
    created.forEach(({ element, inViewport }) => {
        if (!inViewport)
            return;
        const handleEnd = () => {
            element.classList.remove('fadeIn');
            element.removeEventListener(onAnimationEnd, handleEnd);
        };
        element.addEventListener(onAnimationEnd, handleEnd);
        element.classList.add('fadeIn');
    });
    deleted.forEach(({ element, inViewport, position }) => {
        if (!inViewport)
            return;
        const { style } = element;
        const handleEnd = () => {
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
        style.top = `${position.top + shiftTop}px`;
        style.left = `${position.left + shiftLeft}px`;
    });
    return result;
}
