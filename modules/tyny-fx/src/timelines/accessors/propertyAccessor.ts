import { identity, ucfirst } from 'tyny-utils';

import { MaybeAccessor } from './index';

function resolveMethod(target: any, method: string): Function | undefined {
  return method in target && typeof target[method] === 'function'
    ? target[method]
    : undefined;
}

export default function propertyAccessor(
  target: any,
  property: string
): MaybeAccessor {
  const getter = resolveMethod(target, `get${ucfirst(property)}`);
  const setter = resolveMethod(target, `set${ucfirst(property)}`);

  if (getter && setter) {
    return {
      target,
      property,
      convert: identity,
      getValue: (): any => getter.call(target),
      setValue: (value: any) => setter.call(target, value),
    };
  }

  if (target.hasOwnProperty(property)) {
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