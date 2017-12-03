import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface EnumDataTypeOptions extends DefaultDataTypeOptions<number> {
  type: 'enum';

  /**
   * The enumeration that defines the valid values.
   */
  values: any;
}

export function toEnum(values: any) {
  const lookupTable: any = {};
  if (typeof values === 'object') {
    Object.keys(values).forEach(value => {
      if (!/^\d+$/.test(value)) {
        lookupTable[value.toLowerCase()] = values[value];
      }
    });
  }

  return function(value: any): number | undefined {
    if (typeof value == 'string') {
      value = value.toLowerCase();
      return value in lookupTable ? lookupTable[value] : undefined;
    }

    if (value in values) {
      return value;
    }

    return undefined;
  };
}

export default function enumDataType(
  options: EnumDataTypeOptions
): DataType<number | undefined> {
  return dataReader(options, toEnum(options.values));
}
