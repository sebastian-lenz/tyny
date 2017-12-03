import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface ObjectDataTypeOptions extends DefaultDataTypeOptions<object> {
  type: 'object';
}

function toObject(value: any): object | undefined {
  if (typeof value == 'string') {
    return JSON.parse(value);
  } else if (typeof value == 'object') {
    return value;
  }

  return undefined;
}

export default function objectDataType(
  options: ObjectDataTypeOptions
): DataType<object | undefined> {
  return dataReader(options, toObject);
}
