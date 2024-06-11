import { animate } from '../../../fx/animate';
import { TransitionEffect } from '../createTransition';

export interface CreateTransitionOptions {
  fadeIn?: number;
  fadeInDelay?: number;
  fadeInKeyFrames?: string;
  fadeOut?: number;
  fadeOutKeyFrames?: string;
}

export function createTransitionEffect({
  fadeIn = 300,
  fadeInDelay = -1,
  fadeInKeyFrames = 'fadeIn',
  fadeOut = 300,
  fadeOutKeyFrames = 'fadeOut',
}: CreateTransitionOptions = {}): TransitionEffect {
  return (from, to) => {
    const animations: Array<Promise<void>> = [];
    if (from instanceof HTMLElement) {
      from.classList.add('hidden');
      animations.push(
        animate(from, fadeOutKeyFrames, { duration: fadeOut, fillMode: 'both' })
      );
    }

    if (to instanceof HTMLElement) {
      animations.push(
        animate(to, fadeInKeyFrames, {
          delay: fadeInDelay < 0 ? (from ? fadeOut : 0) : fadeInDelay,
          duration: fadeIn,
          fillMode: 'both',
        })
      );
    }

    return Promise.all(animations);
  };
}

export const dissolve = createTransitionEffect;
