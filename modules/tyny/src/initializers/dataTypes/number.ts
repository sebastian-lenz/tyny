import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface NumberDataTypeOptions extends DefaultDataTypeOptions<number> {
  type: 'number';
}

function toNumber(value: any): number | undefined {
  if (typeof value === 'string') {
    return parseFloat(value);
  } else if (typeof value === 'number') {
    return value;
  }

  return undefined;
}

export default function numberDataType(
  options: NumberDataTypeOptions
): DataType<number | undefined> {
  return dataReader(options, toNumber);
}
