import { EasingFunction } from '../index';

export function createEaseInOutElastic(
  amplitude?: number,
  period?: number
): EasingFunction {
  const result: EasingFunction = <any>(
    function easeInOutElastic(
      time: number,
      base: number,
      change: number,
      duration: number
    ): number {
      let scale: number;
      if (time == 0) return base;
      if ((time /= duration / 2) == 2) return base + change;

      if (!period) period = duration * (0.3 * 1.5);
      if (!amplitude || amplitude < Math.abs(change)) {
        amplitude = change;
        scale = period / 4;
      } else {
        scale = (period / (2 * Math.PI)) * Math.asin(change / amplitude);
      }

      if (time < 1) {
        return (
          -0.5 *
            (amplitude *
              Math.pow(2, 10 * (time -= 1)) *
              Math.sin(((time * duration - scale) * (2 * Math.PI)) / period)) +
          base
        );
      }

      return (
        amplitude *
          Math.pow(2, -10 * (time -= 1)) *
          Math.sin(((time * duration - scale) * (2 * Math.PI)) / period) *
          0.5 +
        change +
        base
      );
    }
  );

  result.toCSS = () => 'ease-in-out';
  return result;
}

const easeInOutElastic = createEaseInOutElastic();
export { easeInOutElastic };
