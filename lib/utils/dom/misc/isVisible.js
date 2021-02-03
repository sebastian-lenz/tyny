import { toElements } from './toElements';
export function isVisible(element) {
    return toElements(element).some((element) => element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length);
}
