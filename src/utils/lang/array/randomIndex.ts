import { randomInt } from '../number/randomInt';

export function randomIndex(value: Array<any>): number {
  return randomInt(0, value.length - 1);
}
