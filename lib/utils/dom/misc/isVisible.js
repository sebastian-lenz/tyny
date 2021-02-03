import { toElements } from './toElements';
export function isVisible(element) {
    return toElements(element).some(function (element) {
        return element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length;
    });
}
