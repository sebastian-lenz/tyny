function easeInExpo(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return time == 0
    ? base
    : change * Math.pow(2, 10 * (time / duration - 1)) + base;
}

namespace easeInExpo {
  export function toCSS() {
    return 'cubic-bezier(0.95, 0.05, 0.795, 0.035)';
  }
}

export { easeInExpo };
