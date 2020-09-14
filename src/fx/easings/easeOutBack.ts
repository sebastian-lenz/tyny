import { EasingFunction } from '../index';

export function createEaseOutBack(scale: number = 1.70158): EasingFunction {
  const result: EasingFunction = <any>(
    function easeOutBack(
      time: number,
      base: number,
      change: number,
      duration: number
    ): number {
      return (
        change *
          ((time = time / duration - 1) * time * ((scale + 1) * time + scale) +
            1) +
        base
      );
    }
  );

  result.toCSS = () => 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  return result;
}

const easeOutBack = createEaseOutBack();
export { easeOutBack };
