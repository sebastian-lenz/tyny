function easeInOutQuart(
  time: number,
  base: number,
  change: number,
  duartion: number
): number {
  if ((time /= duartion / 2) < 1) {
    return (change / 2) * time * time * time * time + base;
  }

  return (-change / 2) * ((time -= 2) * time * time * time - 2) + base;
}

namespace easeInOutQuart {
  export function toCSS() {
    return 'cubic-bezier(0.77, 0, 0.175, 1)';
  }
}

export { easeInOutQuart };
