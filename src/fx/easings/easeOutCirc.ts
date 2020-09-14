function easeOutCirc(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return change * Math.sqrt(1 - (time = time / duration - 1) * time) + base;
}

namespace easeOutCirc {
  export function toCSS() {
    return 'cubic-bezier(0.075, 0.82, 0.165, 1)';
  }
}

export { easeOutCirc };
