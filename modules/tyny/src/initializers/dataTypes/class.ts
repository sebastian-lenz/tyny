import { DataType, DefaultDataTypeOptions } from './index';
import dataReader from '../utils/dataReader';

export interface ClassDataTypeOptions<T> extends DefaultDataTypeOptions<T> {
  type: 'class';

  /**
   * The constructor function of the class.
   */
  ctor: { new (data: any): T };
}

export default function classDataType<T>(
  options: ClassDataTypeOptions<T>
): DataType<T> {
  const { ctor } = options;
  return dataReader(
    options,
    (value: any): T => (value instanceof ctor ? value : new ctor(value))
  );
}
