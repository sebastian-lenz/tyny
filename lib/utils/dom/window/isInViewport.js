import { clientRectIntersects } from '../../lang/geom/clientRectIntersects';
import { isVisible } from '../misc/isVisible';
import { getScrollParents, getViewport } from './getScrollParents';
import { getRect } from '../dimensions/getRect';
function overflowParents(element) {
    return getScrollParents(element, /auto|scroll|hidden/);
}
export function isInViewport(element, offsetTop, offsetLeft) {
    if (offsetTop === void 0) { offsetTop = 0; }
    if (offsetLeft === void 0) { offsetLeft = 0; }
    if (!isVisible(element)) {
        return false;
    }
    var parents = overflowParents(element);
    return parents.every(function (parent, index) {
        var client = getRect(parents[index + 1] || element);
        var _a = getRect(getViewport(parent)), top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
        return clientRectIntersects(client, {
            top: top - offsetTop,
            left: left - offsetLeft,
            bottom: bottom + offsetTop,
            right: right + offsetLeft,
        });
    });
}
