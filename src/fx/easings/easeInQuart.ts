function easeInQuart(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * (time /= duration) * time * time * time + base;
}

namespace easeInQuart {
  export function toCSS() {
    return 'cubic-bezier(0.895, 0.03, 0.685, 0.22)';
  }
}

export { easeInQuart };
