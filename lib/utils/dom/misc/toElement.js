import { isElement } from './isElement';
import { isNodeCollection } from './isNodeCollection';
import { toElements } from './toElements';
export function toElement(element) {
    if (isElement(element)) {
        return element;
    }
    else if (isNodeCollection(element) || Array.isArray(element)) {
        return toElements(element)[0] || null;
    }
    return null;
}
