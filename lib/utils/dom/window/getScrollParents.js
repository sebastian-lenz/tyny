import { css } from '../style/css';
import { getRect } from '../dimensions/getRect';
import { parents } from '../node/parents';
import { toWindow } from '../misc/toWindow';
function getScrollingElement(element) {
    const { document } = toWindow(element);
    return document.scrollingElement || document.documentElement;
}
export function getViewport(element) {
    return element === getScrollingElement(element) ? window : element;
}
export function getScrollParents(element, overflowRe = /auto|scroll/) {
    const scrollEl = getScrollingElement(element);
    const scrollParents = parents(element)
        .filter((parent) => {
        if (parent === scrollEl) {
            return true;
        }
        return (overflowRe.test(css(parent, 'overflow') || '') &&
            parent.scrollHeight > getRect(parent).height);
    })
        .reverse();
    return scrollParents.length ? scrollParents : [scrollEl];
}
