import { toNodes } from '../misc';
export function removeNode(element) {
    toNodes(element).map(function (element) { return element.parentNode && element.parentNode.removeChild(element); });
}
