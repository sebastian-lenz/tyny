import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface AnyDataTypeOptions extends DefaultDataTypeOptions<any> {
  type: 'any';
}

export default function anyDataType(
  options: AnyDataTypeOptions
): DataType<any> {
  return dataReader(options);
}
