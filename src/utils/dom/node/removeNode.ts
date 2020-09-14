import { toNodes } from '../misc';

export function removeNode(element: tyny.ElementLike): void {
  toNodes(element).map(
    (element) => element.parentNode && element.parentNode.removeChild(element)
  );
}
