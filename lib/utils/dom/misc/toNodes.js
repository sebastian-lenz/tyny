import { isNode } from './isNode';
import { isNodeCollection } from './isNodeCollection';
import { notNullified } from '../../lang/misc/notNullified';
import { toNode } from './toNode';
export function toNodes(value) {
    if (isNode(value)) {
        return [value];
    }
    if (isNodeCollection(value)) {
        value = Array.prototype.slice.call(value);
    }
    return Array.isArray(value) ? value.map(toNode).filter(notNullified) : [];
}
