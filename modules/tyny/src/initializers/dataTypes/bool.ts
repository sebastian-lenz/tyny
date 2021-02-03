import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface BoolDataTypeOptions extends DefaultDataTypeOptions<boolean> {
  type: 'bool';
}

export function toBoolean(value: any): boolean {
  if (typeof value === 'string') {
    value = value.toLowerCase();
    return value == 'true' || value == 'yes' || value == '1';
  }

  return !!value;
}

export default function boolDataType(
  options: BoolDataTypeOptions
): DataType<boolean> {
  return dataReader(options, toBoolean);
}
