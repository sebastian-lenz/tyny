function easeOutCubic(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * ((time = time / duration - 1) * time * time + 1) + base;
}

namespace easeOutCubic {
  export function toCSS() {
    return 'cubic-bezier(0.215, 0.61, 0.355, 1)';
  }
}

export { easeOutCubic };
