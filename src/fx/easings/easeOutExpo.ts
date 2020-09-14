function easeOutExpo(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return time == duration
    ? base + change
    : change * (-Math.pow(2, (-10 * time) / duration) + 1) + base;
}

namespace easeOutExpo {
  export function toCSS() {
    return 'cubic-bezier(0.19, 1, 0.22, 1)';
  }
}

export { easeOutExpo };
