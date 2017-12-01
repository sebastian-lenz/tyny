import * as bezier from 'bezier-easing';

import { EasingFunction } from '../index';

export default function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction {
  const easing = bezier(x1, y1, x2, y1);
  const result: EasingFunction = <any>function cubicBezier(
    time: number,
    base: number,
    change: number,
    duration: number
  ): number {
    return base + easing(time / duration) * change;
  };

  result.toCSS = () => `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  return result;
}
