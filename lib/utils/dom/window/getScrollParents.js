import { css } from '../style/css';
import { getRect } from '../dimensions/getRect';
import { parents } from '../node/parents';
import { toWindow } from '../misc/toWindow';
function getScrollingElement(element) {
    var document = toWindow(element).document;
    return document.scrollingElement || document.documentElement;
}
export function getViewport(element) {
    return element === getScrollingElement(element) ? window : element;
}
export function getScrollParents(element, overflowRe) {
    if (overflowRe === void 0) { overflowRe = /auto|scroll/; }
    var scrollEl = getScrollingElement(element);
    var scrollParents = parents(element)
        .filter(function (parent) {
        if (parent === scrollEl) {
            return true;
        }
        return (overflowRe.test(css(parent, 'overflow') || '') &&
            parent.scrollHeight > getRect(parent).height);
    })
        .reverse();
    return scrollParents.length ? scrollParents : [scrollEl];
}
