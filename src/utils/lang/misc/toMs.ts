import { endsWith } from '../string/endsWith';
import { toFloat } from '../number/toFloat';

export function toMs(time: any): number {
  if (!time) {
    return 0;
  } else if (endsWith(time, 'ms')) {
    return toFloat(time);
  }

  return toFloat(time) * 1000;
}
