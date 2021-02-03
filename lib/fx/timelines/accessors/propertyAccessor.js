import { identity } from '../../../utils/lang/function/identity';
import { ucFirst } from '../../../utils/lang/string/ucFirst';
function resolveMethod(target, method) {
    return method in target && typeof target[method] === 'function'
        ? target[method]
        : undefined;
}
export function propertyAccessor(target, property) {
    var getter = resolveMethod(target, "get" + ucFirst(property));
    var setter = resolveMethod(target, "set" + ucFirst(property));
    if (getter && setter) {
        return {
            target: target,
            property: property,
            convert: identity,
            getValue: function () { return getter.call(target); },
            setValue: function (value) { return setter.call(target, value); },
        };
    }
    if (property in target) {
        return {
            target: target,
            property: property,
            convert: identity,
            getValue: getter
                ? function () { return getter.call(target); }
                : function () { return target[property]; },
            setValue: setter
                ? function (value) { return setter.call(target, value); }
                : function (value) { return (target[property] = value); },
        };
    }
    return undefined;
}
