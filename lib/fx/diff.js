import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
/**
 * Calculate the difference between two lists of elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 */
export function diff(initialElements, callback) {
    var deleted = [];
    var created = [];
    var changed = [];
    var positions = initialElements.map(function (el) {
        return el.getBoundingClientRect();
    });
    var min = 0;
    var max = getWindowWidth();
    var isInViewport = function (top, bottom) {
        return bottom > min && top < max;
    };
    callback().forEach(function (element) {
        var position = element.getBoundingClientRect();
        var index = initialElements.indexOf(element);
        var inViewport = isInViewport(position.top, position.bottom);
        if (index == -1) {
            created.push({ element: element, position: position, inViewport: inViewport });
        }
        else {
            var oldPosition = positions[index];
            positions[index] = null;
            if (!oldPosition) {
                return;
            }
            changed.push({
                element: element,
                from: oldPosition,
                to: position,
                inViewport: inViewport || isInViewport(oldPosition.top, oldPosition.bottom),
            });
        }
    });
    initialElements.forEach(function (element, index) {
        var position = positions[index];
        if (position) {
            deleted.push({
                element: element,
                position: position,
                inViewport: isInViewport(position.top, position.bottom),
            });
        }
    });
    return {
        changed: changed,
        created: created,
        deleted: deleted,
    };
}
