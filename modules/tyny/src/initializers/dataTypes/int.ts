import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface IntDataTypeOptions extends DefaultDataTypeOptions<number> {
  type: 'int';
}

export function toInteger(value: any): number | undefined {
  if (typeof value === 'string') {
    return parseInt(value);
  } else if (typeof value === 'number') {
    return Math.round(value);
  }

  return undefined;
}

export default function intDataType(
  options: IntDataTypeOptions
): DataType<number | undefined> {
  return dataReader(options, toInteger);
}
