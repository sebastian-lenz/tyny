import { animate } from '../../../fx/animate';
import { TransitionEffect } from '../createTransition';

export interface DissolveOptions {
  fadeIn?: number;
  fadeInKeyFrames?: string;
  fadeOut?: number;
  fadeOutKeyFrames?: string;
}

export function dissolve({
  fadeIn = 300,
  fadeInKeyFrames = 'fadeIn',
  fadeOut = 300,
  fadeOutKeyFrames = 'fadeOut',
}: DissolveOptions = {}): TransitionEffect {
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
          delay: from ? fadeOut : 0,
          duration: fadeIn,
          fillMode: 'both',
        })
      );
    }

    return Promise.all(animations);
  };
}
