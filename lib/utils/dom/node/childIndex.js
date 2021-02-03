import { toNodes, toNode } from '../misc';
import { parent } from './parent';
import { children } from './children';
export function childIndex(element, ref) {
    return ref
        ? toNodes(element).indexOf(toNode(ref))
        : children(parent(element)).indexOf(element);
}
