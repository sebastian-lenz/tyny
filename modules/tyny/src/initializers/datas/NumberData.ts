import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface NumberDataOptions extends DataOptions<number> {
  type: 'number';
}

export default class NumberData extends Data<number, NumberDataOptions> {
  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): number | undefined {
    if (typeof value === 'string') {
      return parseFloat(value);
    } else if (typeof value === 'number') {
      return value;
    }

    return undefined;
  }
}
