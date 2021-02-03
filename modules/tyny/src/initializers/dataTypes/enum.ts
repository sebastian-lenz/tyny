import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface EnumDataTypeOptions
  extends DefaultDataTypeOptions<number | string> {
  type: 'enum';

  /**
   * The enumeration that defines the valid values.
   */
  values: any;
}

export function toEnum<T extends Object>(
  enumType: T,
  value: any
): T[keyof T] | undefined {
  if (enumType.hasOwnProperty(value)) {
    return value;
  }

  if (typeof value === 'string') {
    value = value.toLowerCase();
    for (let key in enumType) {
      const enumValue = enumType[key];
      if (typeof enumValue === 'string') {
        if (enumValue.toLowerCase() === value.toLowerCase()) {
          return parseInt(key) as any;
        }
      } else if (value === enumValue) {
        return enumValue;
      }
    }
  }

  return undefined;
}

export default function enumDataType(
  options: EnumDataTypeOptions
): DataType<number | string | undefined> {
  return dataReader(options, value => toEnum(options.values, value));
}
