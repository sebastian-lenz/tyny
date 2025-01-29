import { random } from './random';

export function randomInt(min: number, max: number): number {
  return Math.round(random(min, max));
}
