import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface IntDataOptions extends DataOptions<number> {
  type: 'int';
}

export default class IntData extends Data<number, IntDataOptions> {
  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): number | undefined {
    if (typeof value === 'string') {
      return parseInt(value);
    } else if (typeof value === 'number') {
      return Math.round(value);
    }

    return undefined;
  }
}
