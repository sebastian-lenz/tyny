import { identity } from '../../../utils/lang/function/identity';
import { MaybeAccessor } from './index';
import { ucFirst } from '../../../utils/lang/string/ucFirst';

function resolveMethod(target: any, method: string): Function | undefined {
  return method in target && typeof target[method] === 'function'
    ? target[method]
    : undefined;
}

export function propertyAccessor(target: any, property: string): MaybeAccessor {
  const getter = resolveMethod(target, `get${ucFirst(property)}`);
  const setter = resolveMethod(target, `set${ucFirst(property)}`);

  if (getter && setter) {
    return {
      target,
      property,
      convert: identity,
      getValue: (): any => getter.call(target),
      setValue: (value: any) => setter.call(target, value),
    };
  }

  if (property in target) {
    return {
      target,
      property,
      convert: identity,
      getValue: getter
        ? (): any => getter.call(target)
        : (): any => target[property],
      setValue: setter
        ? (value: any) => setter.call(target, value)
        : (value: any) => (target[property] = value),
    };
  }

  return undefined;
}
