import { animate } from '../animate';
import { fadeIn } from './keyframes/fadeIn';
import { fadeOut } from './keyframes/fadeOut';
import { Transition } from './index';

export interface FadeOptions {
  duration?: number;
  delay?: number;
  timingFunction?: string;
}

export function fade(options: FadeOptions = {}): Transition {
  const merged = {
    ...animate.defaultOptions,
    ...options,
  };

  return (
    from?: HTMLElement | null,
    to?: HTMLElement | null
  ): Promise<void> => {
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
