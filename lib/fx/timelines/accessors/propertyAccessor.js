import { identity } from '../../../utils/lang/function/identity';
import { ucFirst } from '../../../utils/lang/string/ucFirst';
function resolveMethod(target, method) {
    return method in target && typeof target[method] === 'function'
        ? target[method]
        : undefined;
}
export function propertyAccessor(target, property) {
    const getter = resolveMethod(target, `get${ucFirst(property)}`);
    const setter = resolveMethod(target, `set${ucFirst(property)}`);
    if (getter && setter) {
        return {
            target,
            property,
            convert: identity,
            getValue: () => getter.call(target),
            setValue: (value) => setter.call(target, value),
        };
    }
    if (property in target) {
        return {
            target,
            property,
            convert: identity,
            getValue: getter
                ? () => getter.call(target)
                : () => target[property],
            setValue: setter
                ? (value) => setter.call(target, value)
                : (value) => (target[property] = value),
        };
    }
    return undefined;
}
