import { toElements } from '../misc/toElements';
export function removeAttr(element) {
    var names = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        names[_i - 1] = arguments[_i];
    }
    toElements(element).forEach(function (element) {
        names.forEach(function (name) { return element.removeAttribute(name); });
    });
}
