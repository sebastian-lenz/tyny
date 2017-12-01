import { Transition } from './index';
import animate from '../animate';
import fadeIn from './keyframes/fadeIn';
import fadeOut from './keyframes/fadeOut';

export interface DissolveOptions {
  duration?: number;
  delay?: number;
  timingFunction?: string;
}

export default function dissolve(options: DissolveOptions = {}): Transition {
  return (from?: HTMLElement, to?: HTMLElement): Promise<void> => {
    if (to) {
      return animate(to, fadeIn(), options);
    }

    if (from) {
      return animate(from, fadeOut(), options);
    }

    return Promise.resolve();
  };
}
