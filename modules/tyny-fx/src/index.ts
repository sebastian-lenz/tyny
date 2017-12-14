import animate from './animate';
import momentum from './momentum';
import stop from './stop';
import transist from './transist';
import transistDimensions from './transistDimensions';
import transistHeight from './transistHeight';
import transistWidth from './transistWidth';
import tween from './tween';

export type AnimationPlayState = 'playing' | 'stopped' | 'finished';

export interface Animation<T> extends Promise<T> {
  stop(): void;
}

/**
 * Timing function type declaration.
 */
export interface EasingFunction {
  (time: number, base: number, change: number, duration: number): number;
  toCSS(): string;
}

export {
  animate,
  momentum,
  stop,
  transist,
  transistDimensions,
  transistHeight,
  transistWidth,
  tween,
};
