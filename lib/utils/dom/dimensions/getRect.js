import { isWindow } from '../misc/isWindow';
import { toWindow } from '../misc/toWindow';
function getElementRect(element, left, top) {
    var rect = element.getBoundingClientRect();
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
    var height = element.innerHeight;
    var width = element.innerWidth;
    return {
        bottom: top + height,
        height: height,
        left: left,
        right: left + width,
        top: top,
        width: width,
    };
}
export function getRect(element) {
    var _a = toWindow(element), left = _a.pageXOffset, top = _a.pageYOffset;
    return isWindow(element)
        ? getWindowRect(element, left, top)
        : getElementRect(element, left, top);
}
