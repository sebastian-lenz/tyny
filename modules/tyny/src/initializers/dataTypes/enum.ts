import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface EnumDataTypeOptions extends DefaultDataTypeOptions<number> {
  type: 'enum';

  /**
   * The enumeration that defines the valid values.
   */
  values: any;
}

export default function enumDataType(
  options: EnumDataTypeOptions
): DataType<number | undefined> {
  const { values } = options;
  const lookupTable: any = {};
  Object.keys(values).forEach(value => {
    if (!/^\d+$/.test(value)) {
      lookupTable[value.toLowerCase()] = values[value];
    }
  });

  return dataReader(options, (value: any): number | undefined => {
    if (typeof value == 'string') {
      value = value.toLowerCase();
      return value in lookupTable ? lookupTable[value] : undefined;
    }

    if (value in values) {
      return value;
    }

    return undefined;
  });
}
