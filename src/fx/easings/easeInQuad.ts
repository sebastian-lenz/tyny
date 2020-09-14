function easeInQuad(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * (time /= duration) * time + base;
}

namespace easeInQuad {
  export function toCSS() {
    return 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
  }
}

export { easeInQuad };
