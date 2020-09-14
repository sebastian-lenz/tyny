import { animation, onAnimationEnd } from '../utils/env/animationProps';

export interface AnimateOptions {
  duration: number;
  delay: number;
  timingFunction: string;
  fillMode: string | 'none' | 'forwards' | 'backwards' | 'both';
}

function animate(
  element: HTMLElement,
  name: string,
  options: Partial<AnimateOptions> = {}
): Promise<void> {
  const defaults = animate.defaultOptions;
  const {
    duration = defaults.duration,
    delay = defaults.delay,
    timingFunction = defaults.timingFunction,
    fillMode = defaults.fillMode,
  } = options;

  return new Promise((resolve) => {
    const style = element.style as any;
    const value = `${name} ${duration}ms ${timingFunction} ${delay}ms ${fillMode}`;

    const handleAnimationEnd = (event: Event | undefined) => {
      if (event && event.target !== element) return;
      element.removeEventListener(onAnimationEnd, handleAnimationEnd);
      clearTimeout(timeout);
      style[animation] = '';
      resolve();
    };

    const timeout = setTimeout(handleAnimationEnd, duration + delay + 100);
    element.addEventListener(onAnimationEnd, handleAnimationEnd);
    style[animation] = value;
  });
}

namespace animate {
  export const defaultOptions: AnimateOptions = {
    delay: 0,
    duration: 400,
    timingFunction: 'ease-in-out',
    fillMode: 'both',
  };
}

export { animate };
