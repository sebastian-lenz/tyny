import { animate } from '../animate';
import { transform } from './keyframes/transform';
import { Transition } from './index';

export interface RollOptions {
  duration?: number;
  delay?: number;
  timingFunction?: string;
  x?: number;
  y?: number;
}

export function roll({
  x = 0,
  y = 0,
  ...options
}: RollOptions = {}): Transition {
  const merged = {
    ...animate.defaultOptions,
    ...options,
  };

  const fromAnimation = transform({
    fromTransform: `translate(0, 0)`,
    toTransform: `translate(${-x}%, ${-y}%)`,
  });

  const toAnimation = transform({
    fromTransform: `translate(${x}%, ${y}%)`,
    toTransform: `translate(0, 0)`,
  });

  return (
    from?: HTMLElement | null,
    to?: HTMLElement | null
  ): Promise<void> => {
    const animations = [];

    if (to) {
      animations.push(animate(to, toAnimation, merged));
    }

    if (from) {
      animations.push(animate(from, fromAnimation, merged));
    }

    return animations.length
      ? Promise.all(animations).then(() => undefined)
      : Promise.resolve();
  };
}
