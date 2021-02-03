import { noop } from '../../lang/function/noop';
import { toElements } from '../misc';
var elProto = Element ? Element.prototype : {};
var matchesFn = elProto.matches ||
    elProto.webkitMatchesSelector ||
    elProto.msMatchesSelector ||
    noop;
export function matches(element, selector) {
    return toElements(element).some(function (element) {
        return matchesFn.call(element, selector);
    });
}
