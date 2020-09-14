import { easeInBounce } from './easeInBounce';
import { easeOutBounce } from './easeOutBounce';

function easeInOutBounce(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if (time < duration / 2)
    return easeInBounce(time * 2, 0, change, duration) * 0.5 + base;
  return (
    easeOutBounce(time * 2 - duration, 0, change, duration) * 0.5 +
    change * 0.5 +
    base
  );
}

namespace easeInOutBounce {
  export function toCSS() {
    return 'ease-in-out';
  }
}

export { easeInOutBounce };
