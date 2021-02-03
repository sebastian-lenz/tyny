import { clientRectIntersects } from '../../lang/geom/clientRectIntersects';
import { isVisible } from '../misc/isVisible';
import { getScrollParents, getViewport } from './getScrollParents';
import { getRect } from '../dimensions/getRect';
function overflowParents(element) {
    return getScrollParents(element, /auto|scroll|hidden/);
}
export function isInViewport(element, offsetTop = 0, offsetLeft = 0) {
    if (!isVisible(element)) {
        return false;
    }
    const parents = overflowParents(element);
    return parents.every((parent, index) => {
        const client = getRect(parents[index + 1] || element);
        const { top, left, bottom, right } = getRect(getViewport(parent));
        return clientRectIntersects(client, {
            top: top - offsetTop,
            left: left - offsetLeft,
            bottom: bottom + offsetTop,
            right: right + offsetLeft,
        });
    });
}
