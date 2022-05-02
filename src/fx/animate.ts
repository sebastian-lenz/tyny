import { animation, onAnimationEnd } from '../utils/env/animationProps';

export type FillMode = 'none' | 'forwards' | 'backwards' | 'both';
export type Direction =
  | 'inherit'
  | 'normal'
  | 'reverse'
  | 'alternate'
  | 'alternate-reverse';

export interface AnimateOptions {
  delay: number;
  direction: Direction;
  duration: number;
  fillMode: FillMode;
  timingFunction: string;
}

function animate(
  element: HTMLElement,
  name: string,
  options: Partial<AnimateOptions> = {}
): Promise<void> {
  const defaults = animate.defaultOptions;
  const {
    delay = defaults.delay,
    direction = defaults.direction,
    duration = defaults.duration,
    fillMode = defaults.fillMode,
    timingFunction = defaults.timingFunction,
  } = options;

  return new Promise((resolve) => {
    const style = element.style as any;
    const value = `${name} ${duration}ms ${timingFunction} ${delay}ms ${direction} ${fillMode}`;

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
    direction: 'normal',
    duration: 400,
    timingFunction: 'ease-in-out',
    fillMode: 'both',
  };
}

export { animate };
