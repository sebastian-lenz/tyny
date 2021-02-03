import { isWindow } from '../misc/isWindow';
import { toWindow } from '../misc/toWindow';
function getElementRect(element, left, top) {
    const rect = element.getBoundingClientRect();
    return {
        bottom: top + rect.bottom,
        height: rect.height,
        left: left + rect.left,
        right: left + rect.right,
        top: top + rect.top,
        width: rect.width,
    };
}
function getWindowRect(element, left, top) {
    const height = element.innerHeight;
    const width = element.innerWidth;
    return {
        bottom: top + height,
        height,
        left,
        right: left + width,
        top,
        width,
    };
}
export function getRect(element) {
    const { pageXOffset: left, pageYOffset: top } = toWindow(element);
    return isWindow(element)
        ? getWindowRect(element, left, top)
        : getElementRect(element, left, top);
}
