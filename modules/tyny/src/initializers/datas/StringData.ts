import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface StringDataOptions extends DataOptions<string> {
  type: 'string';
}

export default class StringData extends Data<string, StringDataOptions> {
  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): string {
    return `${value}`;
  }
}
