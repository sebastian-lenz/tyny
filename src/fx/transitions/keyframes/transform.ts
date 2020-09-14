import { keyframes } from '../../keyframes';

let id = 0;

export interface TranslateOptions {
  fromTransform: string;
  toTransform: string;
}

export function transform({
  fromTransform,
  toTransform,
}: TranslateOptions): string {
  const name = `tynyTransformKeyframes-${id++}`;
  return keyframes(name, {
    from: {
      transform: fromTransform,
    },
    to: {
      transform: toTransform,
    },
  });
}
