import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface StringDataTypeOptions extends DefaultDataTypeOptions<string> {
  type: 'string';
}

function toString(value: any): string {
  return `${value}`;
}

export default function stringDataType(
  options: StringDataTypeOptions
): DataType<string> {
  return dataReader(options, toString);
}
