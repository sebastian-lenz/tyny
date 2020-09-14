function easeInOutExpo(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if (time == 0) return base;
  if (time == duration) return base + change;
  if ((time /= duration / 2) < 1) {
    return (change / 2) * Math.pow(2, 10 * (time - 1)) + base;
  }

  return (change / 2) * (-Math.pow(2, -10 * --time) + 2) + base;
}

namespace easeInOutExpo {
  export function toCSS() {
    return 'cubic-bezier(1, 0, 0, 1)';
  }
}

export { easeInOutExpo };
