function easeOutQuint(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return (
    change * ((time = time / duration - 1) * time * time * time * time + 1) +
    base
  );
}

namespace easeOutQuint {
  export function toCSS() {
    return 'cubic-bezier(0.23, 1, 0.32, 1)';
  }
}

export { easeOutQuint };
