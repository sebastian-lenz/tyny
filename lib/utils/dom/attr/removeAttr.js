import { toElements } from '../misc/toElements';
export function removeAttr(element, ...names) {
    toElements(element).forEach((element) => {
        names.forEach((name) => element.removeAttribute(name));
    });
}
