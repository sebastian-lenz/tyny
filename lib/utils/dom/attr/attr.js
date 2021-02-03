import { toElement, toElements } from '../misc';
import { isFunction } from '../../lang/function/isFunction';
import { isString } from '../../lang/string/isString';
import { isUndefined } from '../../lang/misc/isUndefined';
import { removeAttr } from './removeAttr';
export function attr(target, param, value) {
    if (!isString(param)) {
        return Object.keys(param).forEach(function (name) {
            return attr(target, name, param[name]);
        });
    }
    if (isUndefined(value)) {
        var element = toElement(target);
        return element ? element.getAttribute(param) : null;
    }
    for (var _i = 0, _a = toElements(target); _i < _a.length; _i++) {
        var element = _a[_i];
        if (isFunction(value)) {
            attr(target, param, value(attr(element, param), element));
        }
        else if (value === null) {
            removeAttr(element, param);
        }
        else {
            element.setAttribute(param, value.toString());
        }
    }
}
