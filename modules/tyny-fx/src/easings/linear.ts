function linear(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return base + change * (time / duration);
}

namespace linear {
  export function toCSS() {
    return 'linear';
  }
}

export default linear;
