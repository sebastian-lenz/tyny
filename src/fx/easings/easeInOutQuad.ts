function easeInOutQuad(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  if ((time /= duration / 2) < 1) {
    return (change / 2) * time * time + base;
  }

  return (-change / 2) * (--time * (time - 2) - 1) + base;
}

namespace easeInOutQuad {
  export function toCSS() {
    return 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
  }
}

export { easeInOutQuad };
