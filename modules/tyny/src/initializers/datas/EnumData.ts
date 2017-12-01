import Data, { DataOptions } from '../Data';
import View from '../../View';

export interface EnumDataOptions extends DataOptions<number> {
  type: 'enum';

  // The enumeration that defines the valid values.
  values: any;
}

export default class EnumData extends Data<number, EnumDataOptions> {
  lookupTable: any;

  values: any;

  /**
   * EnumOption constructor.
   */
  constructor(property: string, options: EnumDataOptions) {
    super(property, options);

    const { values } = options;
    const lookupTable: any = {};
    Object.keys(options.values).forEach(value => {
      if (typeof value === 'string') {
        lookupTable[value.toLowerCase()] = values[value];
      }
    });

    this.lookupTable = lookupTable;
  }

  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): number | undefined {
    const { lookupTable, values } = this;

    if (typeof value == 'string') {
      value = value.toLowerCase();
      return value in lookupTable ? lookupTable[value] : undefined;
    }

    if (value in values) return value;
    return undefined;
  }
}
