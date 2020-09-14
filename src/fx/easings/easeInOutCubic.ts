function easeInOutCubic(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time + base;
  }

  return (change / 2) * ((time -= 2) * time * time + 2) + base;
}

namespace easeInOutCubic {
  export function toCSS() {
    return 'cubic-bezier(0.645, 0.045, 0.355, 1)';
  }
}

export { easeInOutCubic };
