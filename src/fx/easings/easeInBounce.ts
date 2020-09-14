import { easeOutBounce } from './easeOutBounce';

function easeInBounce(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change - easeOutBounce(duration - time, 0, change, duration) + base;
}

namespace easeInBounce {
  export function toCSS() {
    return 'ease-in';
  }
}

export { easeInBounce };
