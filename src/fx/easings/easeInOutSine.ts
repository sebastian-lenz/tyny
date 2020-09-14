function easeInOutSine(
  time: number,
  base: number,
  change: number,
  duration: number
): number {
  return (-change / 2) * (Math.cos((Math.PI * time) / duration) - 1) + base;
}
namespace easeInOutSine {
  export function toCSS() {
    return 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
  }
}

export { easeInOutSine };
