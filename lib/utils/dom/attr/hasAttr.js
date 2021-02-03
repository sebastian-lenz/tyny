import { toElements } from '../misc/toElements';
export function hasAttr(element, name) {
    return toElements(element).some(function (element) { return element.hasAttribute(name); });
}
