function easeOutSine(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * Math.sin((time / duration) * (Math.PI / 2)) + base;
}

namespace easeOutSine {
  export function toCSS() {
    return 'cubic-bezier(0.39, 0.575, 0.565, 1)';
  }
}

export { easeOutSine };
