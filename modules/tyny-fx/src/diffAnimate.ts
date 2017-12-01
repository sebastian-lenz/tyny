import { animationProps } from 'tyny-utils';

import { DiffCallback, DiffResult } from './diff';
import diffPositions, { DiffPositionsOptions } from './diffPositions';

/**
 * Available options for [[diffAnimate]].
 */
export interface DiffAnimateOptions extends DiffPositionsOptions {
  /**
   * Should deleted elements be detached?
   */
  detach?: boolean;

  origin?: HTMLElement;
}

/**
 * Animate the changed positions of the given elements, fade in new elements and fade out deleted elements.
 *
 * @param initialElements  A list of all persistent elements.
 * @param callback  A callback that changes the visible elements and returns the new list.
 * @param options   The advanced options used to animate the elements.
 */
export default function diffAnimate(
  initialElements: HTMLElement[],
  callback: DiffCallback,
  options: DiffAnimateOptions = {}
): DiffResult {
  const result = diffPositions(initialElements, callback, options);
  const { hasAnimation, onAnimationEnd } = animationProps();
  const { created, deleted } = result;
  const { detach = false, origin } = options;
  if (!hasAnimation) {
    return result;
  }

  let shiftTop = 0;
  let shiftLeft = 0;
  if (origin) {
    const originRect = origin.getBoundingClientRect();
    shiftTop = -originRect.top;
    shiftLeft = -originRect.left;
  }

  created.forEach(({ element, inViewport }) => {
    if (!inViewport) return;
    const handleEnd = () => {
      element.classList.remove('fadeIn');
      element.removeEventListener(onAnimationEnd, handleEnd);
    };

    element.addEventListener(onAnimationEnd, handleEnd);
    element.classList.add('fadeIn');
  });

  deleted.forEach(({ element, inViewport, position }) => {
    if (!inViewport) return;
    const { style } = element;
    const handleEnd = () => {
      element.classList.remove('fadeOut');
      style.position = '';
      style.top = '';
      style.left = '';
      element.removeEventListener(onAnimationEnd, handleEnd);

      if (detach && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };

    element.addEventListener(onAnimationEnd, handleEnd);
    element.classList.add('fadeOut');
    style.position = 'absolute';
    style.top = `${position.top + shiftTop}px`;
    style.left = `${position.left + shiftLeft}px`;
  });

  return result;
}
