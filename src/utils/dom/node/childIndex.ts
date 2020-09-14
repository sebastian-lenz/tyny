import { toNodes, toNode } from '../misc';
import { parent } from './parent';
import { children } from './children';

export function childIndex(
  element: tyny.ElementLike,
  ref?: tyny.ElementLike
): number {
  return ref
    ? toNodes(element).indexOf(toNode(ref) as any)
    : children(parent(element)).indexOf(element as any);
}
