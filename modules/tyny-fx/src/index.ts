import 'tyny-polyfills';

import animate, { AnimateOptions } from './animate';
import keyframes from './keyframes';
import momentum, { MomentumOptions } from './momentum';
import spring, { SpringOptions } from './spring';
import stop from './stop';
import transist, { TransistOptions } from './transist';
import transistDimensions, {
  TransistDimensionsOptions,
} from './transistDimensions';
import transistHeight from './transistHeight';
import transistWidth from './transistWidth';
import tween, { TweenOptions } from './tween';
import withoutTransition from './withoutTransition';

/**
 * Timing function type declaration.
 */
export interface EasingFunction {
  (time: number, base: number, change: number, duration: number): number;
  toCSS(): string;
}

export type AnimationPlayState = 'playing' | 'stopped' | 'finished';

export interface Animation<T> extends Promise<T> {
  stop(): void;
}

export * from './easings';
export {
  animate,
  AnimateOptions,
  keyframes,
  momentum,
  MomentumOptions,
  spring,
  SpringOptions,
  stop,
  transist,
  TransistOptions,
  transistDimensions,
  TransistDimensionsOptions,
  transistHeight,
  transistWidth,
  tween,
  TweenOptions,
  withoutTransition,
};
