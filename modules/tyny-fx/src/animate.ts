import { animationProps } from 'tyny-utils';

export interface AnimateOptions {
  duration: number;
  delay: number;
  timingFunction: string;
  fillMode: string | 'none' | 'forwards' | 'backwards' | 'both';
}

function animate(
  element: HTMLElement,
  name: string,
  options: Partial<AnimateOptions>
): Promise<void> {
  const { animation, hasAnimation, onAnimationEnd } = animationProps();
  if (!hasAnimation) {
    return Promise.resolve();
  }

  const defaults = animate.defaultOptions;
  const {
    duration = defaults.duration,
    delay = defaults.delay,
    timingFunction = defaults.timingFunction,
    fillMode = defaults.fillMode,
  } = options;

  return new Promise(resolve => {
    const style = <any>element.style;
    const value = `${name} ${duration}ms ${delay}ms ${timingFunction} ${
      fillMode
    }`;

    const handleAnimationEnd = () => {
      element.removeEventListener(onAnimationEnd, handleAnimationEnd);
      clearTimeout(timeout);
      style[animation] = '';
      resolve();
    };

    const timeout = setTimeout(handleAnimationEnd, duration + 100);
    element.addEventListener(onAnimationEnd, handleAnimationEnd);
    style[animation] = value;
  });
}

namespace animate {
  export const defaultOptions: AnimateOptions = {
    delay: 0,
    duration: 500,
    timingFunction: 'ease-in-out',
    fillMode: 'both',
  };
}

export default animate;
