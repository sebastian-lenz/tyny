import { diff } from './diff';
import { onTransitionEnd } from '../utils/env/transitionProps';
import { transform } from '../utils/env/transformProps';
import { withoutTransition } from './withoutTransition';
export function diffPositions(initialElements, callback, options = {}) {
    const result = diff(initialElements, callback);
    const { finished, useTransform3D } = options;
    let active = 0;
    result.changed.forEach(({ element, from, inViewport, to }) => {
        if (!inViewport)
            return;
        const style = element.style;
        const left = options.ignoreX ? 0 : from.left - to.left;
        const top = options.ignoreY ? 0 : from.top - to.top;
        if (left == 0 && top == 0)
            return;
        const handleEnd = () => {
            style[transform] = '';
            element.removeEventListener(onTransitionEnd, handleEnd);
            active -= 1;
            if (active == 0 && finished)
                finished();
        };
        active += 1;
        withoutTransition(element, () => {
            style[transform] = useTransform3D
                ? `translate3d(${left}px, ${top}px, 0)`
                : `translate(${left}px, ${top}px)`;
        });
        element.addEventListener(onTransitionEnd, handleEnd);
        style[transform] = useTransform3D
            ? `translate3d(0, 0, 0)`
            : `translate(0, 0)`;
    });
    return result;
}
