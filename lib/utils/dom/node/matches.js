import { noop } from '../../lang/function/noop';
import { toElements } from '../misc';
const elProto = typeof Element !== 'undefined' ? Element.prototype : {};
const matchesFn = elProto.matches ||
    elProto.webkitMatchesSelector ||
    elProto.msMatchesSelector ||
    noop;
export function matches(element, selector) {
    return toElements(element).some((element) => matchesFn.call(element, selector));
}
