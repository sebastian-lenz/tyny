function easeInOutQuint(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time * time * time * time + base;
  }

  return (change / 2) * ((time -= 2) * time * time * time * time + 2) + base;
}

namespace easeInOutQuint {
  export function toCSS() {
    return 'cubic-bezier(0.86, 0, 0.07, 1)';
  }
}

export { easeInOutQuint };
