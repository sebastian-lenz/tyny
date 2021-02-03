import { attr } from './attr';
import { hasAttr } from './hasAttr';
export function data(element, attribute) {
    return hasAttr(element, attribute)
        ? attr(element, attribute)
        : attr(element, `data-${attribute}`);
}
