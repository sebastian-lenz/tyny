function easeInSine(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return -change * Math.cos((time / duration) * (Math.PI / 2)) + change + base;
}

namespace easeInSine {
  export function toCSS() {
    return 'cubic-bezier(0.47, 0, 0.745, 0.715)';
  }
}

export { easeInSine };
