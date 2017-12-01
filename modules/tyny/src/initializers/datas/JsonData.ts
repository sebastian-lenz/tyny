import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface JsonDataOptions extends DataOptions<object> {
  type: 'json';
}

export default class JsonData extends Data<object, JsonDataOptions> {
  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): object | undefined {
    if (typeof value == 'string') {
      return JSON.parse(value);
    } else if (typeof value == 'object') {
      return value;
    }

    return undefined;
  }
}
