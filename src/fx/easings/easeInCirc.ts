function easeInCirc(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + base;
}

namespace easeInCirc {
  export function toCSS() {
    return 'cubic-bezier(0.6, 0.04, 0.98, 0.335)';
  }
}

export { easeInCirc };
