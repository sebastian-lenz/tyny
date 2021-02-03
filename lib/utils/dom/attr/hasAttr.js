import { toElements } from '../misc/toElements';
export function hasAttr(element, name) {
    return toElements(element).some((element) => element.hasAttribute(name));
}
