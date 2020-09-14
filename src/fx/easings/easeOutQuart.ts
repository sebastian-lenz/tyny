function easeOutQuart(
  time: number,
  base: number,
  change: number,
  duartion: number
): number {
  return (
    -change * ((time = time / duartion - 1) * time * time * time - 1) + base
  );
}

namespace easeOutQuart {
  export function toCSS() {
    return 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  }
}

export { easeOutQuart };
