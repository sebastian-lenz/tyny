import { EasingFunction } from '../index';

export function createEaseInOutBack(scale: number = 1.70158): EasingFunction {
  const result: EasingFunction = <any>(
    function easeInOutBack(
      time: number,
      base: number,
      change: number,
      duration: number
    ): number {
      if ((time /= duration / 2) < 1) {
        return (
          (change / 2) *
            (time * time * (((scale *= 1.525) + 1) * time - scale)) +
          base
        );
      }

      return (
        (change / 2) *
          ((time -= 2) * time * (((scale *= 1.525) + 1) * time + scale) + 2) +
        base
      );
    }
  );

  result.toCSS = () => 'cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  return result;
}

const easeInOutBack = createEaseInOutBack();
export { easeInOutBack };
