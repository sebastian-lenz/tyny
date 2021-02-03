import { toNodes } from '../misc';
export function removeNode(element) {
    toNodes(element).map((element) => element.parentNode && element.parentNode.removeChild(element));
}
