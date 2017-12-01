import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface BooleanDataOptions extends DataOptions<boolean> {
  type: 'bool';
}

export default class BooleanData extends Data<boolean, BooleanDataOptions> {
  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): boolean {
    if (typeof value === 'string') {
      value = value.toLowerCase();
      return value == 'true' || value == 'yes' || value == '1';
    }

    return !!value;
  }
}
