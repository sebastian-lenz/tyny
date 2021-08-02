import { isElement, toElements } from '../misc';
import { matches } from './matches';
import { notNullified } from '../../lang/misc/notNullified';
import { parent } from './parent';
import { startsWith } from '../../lang/string/startsWith';
const elProto = typeof Element !== 'undefined' ? Element.prototype : {};
const closestFn = elProto.closest ||
    function (selector) {
        let ancestor = this;
        do {
            if (matches(ancestor, selector)) {
                return ancestor;
            }
        } while ((ancestor = parent(ancestor)));
    };
export function closest(element, selector) {
    if (startsWith(selector, '>')) {
        selector = selector.slice(1);
    }
    if (!element) {
        return null;
    }
    return isElement(element)
        ? closestFn.call(element, selector)
        : toElements(element)
            .map((element) => closest(element, selector))
            .filter(notNullified);
}
