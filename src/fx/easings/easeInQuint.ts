function easeInQuint(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * (time /= duration) * time * time * time * time + base;
}

namespace easeInQuint {
  export function toCSS() {
    return 'cubic-bezier(0.755, 0.05, 0.855, 0.06)';
  }
}

export { easeInQuint };
