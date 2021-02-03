import { toElement, toElements } from '../misc';
import { isFunction } from '../../lang/function/isFunction';
import { isString } from '../../lang/string/isString';
import { isUndefined } from '../../lang/misc/isUndefined';
import { removeAttr } from './removeAttr';
export function attr(target, param, value) {
    if (!isString(param)) {
        return Object.keys(param).forEach((name) => attr(target, name, param[name]));
    }
    if (isUndefined(value)) {
        const element = toElement(target);
        return element ? element.getAttribute(param) : null;
    }
    for (const element of toElements(target)) {
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
