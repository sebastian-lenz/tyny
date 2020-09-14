function easeInCubic(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * (time /= duration) * time * time + base;
}

namespace easeInCubic {
  export function toCSS() {
    return 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
  }
}

export { easeInCubic };
