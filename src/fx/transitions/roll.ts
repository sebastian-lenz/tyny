import { animate } from '../animate';
import { transform } from './keyframes/transform';
import { Transition } from './index';

export interface RollOptions {
  duration?: number;
  delay?: number;
  fade?: boolean;
  timingFunction?: string;
  x?: number;
  y?: number;
}

export function roll({
  fade = false,
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
    extraFrom: fade ? { opacity: 1 } : {},
    extraTo: fade ? { opacity: 0 } : {},
  });

  const toAnimation = transform({
    fromTransform: `translate(${x}%, ${y}%)`,
    toTransform: `translate(0, 0)`,
    extraFrom: fade ? { opacity: 0 } : {},
    extraTo: fade ? { opacity: 1 } : {},
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
