function easeOutBounce(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if ((time /= duration) < 1 / 2.75) {
    return change * (7.5625 * time * time) + base;
  } else if (time < 2 / 2.75) {
    return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + base;
  } else if (time < 2.5 / 2.75) {
    return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + base;
  } else {
    return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + base;
  }
}

namespace easeOutBounce {
  export function toCSS() {
    return 'ease-out';
  }
}

export { easeOutBounce };
