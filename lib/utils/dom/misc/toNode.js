import { isNode } from './isNode';
import { isNodeCollection } from './isNodeCollection';
export function toNode(value) {
    if (isNode(value)) {
        return value;
    }
    if (isNodeCollection(value) || Array.isArray(value)) {
        return toNode(value[0]);
    }
    return null;
}
