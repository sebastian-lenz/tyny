import { Transition } from './index';

import animate from '../animate';
import fadeIn from './keyframes/fadeIn';
import fadeOut from './keyframes/fadeOut';

export interface DissolveOptions {
  duration?: number;
  delay?: number;
  noCrossFade?: boolean;
  noPureFadeIn?: boolean;
  noPureFadeOut?: boolean;
  timingFunction?: string;
}

export default function dissolve(options: DissolveOptions = {}): Transition {
  const {
    noCrossFade,
    noPureFadeIn,
    noPureFadeOut,
    ...animationOptions
  } = options;

  return (from?: HTMLElement, to?: HTMLElement): Promise<void> => {
    const animations = [];
    if (from && to && noCrossFade) {
      animations.push(animate(to, fadeIn(), animationOptions));
    } else {
      if (from && (!noPureFadeOut || to)) {
        animations.push(animate(from, fadeOut(), animationOptions));
      }

      if (to && (!noPureFadeIn || from)) {
        animations.push(animate(to, fadeIn(), animationOptions));
      }
    }

    return animations.length
      ? Promise.all(animations).then(() => undefined)
      : Promise.resolve();
  };
}
