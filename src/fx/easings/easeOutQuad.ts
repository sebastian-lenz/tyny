function easeOutQuad(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return -change * (time /= duration) * (time - 2) + base;
}

namespace easeOutQuad {
  export function toCSS() {
    return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  }
}

export { easeOutQuad };
