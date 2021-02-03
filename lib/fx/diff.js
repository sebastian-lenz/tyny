import { getWindowWidth } from '../utils/dom/window/getWindowWidth';
/**
 * Calculate the difference between two lists of elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 */
export function diff(initialElements, callback) {
    const deleted = [];
    const created = [];
    const changed = [];
    const positions = initialElements.map((el) => el.getBoundingClientRect());
    const min = 0;
    const max = getWindowWidth();
    const isInViewport = (top, bottom) => bottom > min && top < max;
    callback().forEach((element) => {
        const position = element.getBoundingClientRect();
        const index = initialElements.indexOf(element);
        const inViewport = isInViewport(position.top, position.bottom);
        if (index == -1) {
            created.push({ element, position, inViewport });
        }
        else {
            const oldPosition = positions[index];
            positions[index] = null;
            if (!oldPosition) {
                return;
            }
            changed.push({
                element,
                from: oldPosition,
                to: position,
                inViewport: inViewport || isInViewport(oldPosition.top, oldPosition.bottom),
            });
        }
    });
    initialElements.forEach((element, index) => {
        const position = positions[index];
        if (position) {
            deleted.push({
                element,
                position,
                inViewport: isInViewport(position.top, position.bottom),
            });
        }
    });
    return {
        changed,
        created,
        deleted,
    };
}
