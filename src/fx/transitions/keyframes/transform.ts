import { keyframes } from '../../keyframes';

let id = 0;

export interface TranslateOptions {
  extraFrom?: any;
  extraTo?: any;
  fromTransform: string;
  toTransform: string;
}

export function transform({
  extraFrom = {},
  extraTo = {},
  fromTransform,
  toTransform,
}: TranslateOptions): string {
  const name = `tynyTransformKeyframes-${id++}`;
  return keyframes(name, {
    from: {
      ...extraFrom,
      transform: fromTransform,
    },
    to: {
      ...extraTo,
      transform: toTransform,
    },
  });
}
