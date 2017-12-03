import { Transition } from './index';

import animate from '../animate';
import fadeIn from './keyframes/fadeIn';
import fadeOut from './keyframes/fadeOut';

export interface FadeOptions {
  duration?: number;
  delay?: number;
  timingFunction?: string;
}

export default function fade(options: FadeOptions = {}): Transition {
  const merged = {
    ...animate.defaultOptions,
    ...options,
  };

  return (from?: HTMLElement, to?: HTMLElement): Promise<void> => {
    if (from && to) {
      const { delay, duration } = merged;
      return Promise.all([
        animate(from, fadeOut(), {
          ...merged,
          delay: 0,
          duration: duration * 0.5,
        }).then(() => {
          from.style.visibility = 'hidden';
        }),
        animate(to, fadeIn(), {
          ...merged,
          delay: duration * 0.5 + delay,
          duration: duration * 0.5,
        }),
      ]).then(() => {
        from.style.visibility = '';
        return undefined;
      });
    }

    if (to) {
      return animate(to, fadeIn(), merged);
    }

    if (from) {
      return animate(from, fadeOut(), merged);
    }

    return Promise.resolve();
  };
}
