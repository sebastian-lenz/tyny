import View, { ViewOptions } from '../../View';

import anyDataType, { AnyDataTypeOptions } from './any';
import boolDataType, { BoolDataTypeOptions } from './bool';
import classDataType, { ClassDataTypeOptions } from './class';
import elementDataType, { ElementDataTypeOptions } from './element';
import elementsDataType, { ElementsDataTypeOptions } from './elements';
import enumDataType, { EnumDataTypeOptions } from './enum';
import intDataType, { IntDataTypeOptions } from './int';
import numberDataType, { NumberDataTypeOptions } from './number';
import objectDataType, { ObjectDataTypeOptions } from './object';
import ownerDataType, { OwnerDataTypeOptions } from './owner';
import stringDataType, { StringDataTypeOptions } from './string';

export interface DataType<T> {
  (view: View, viewOptions: ViewOptions): T | undefined;
}

export interface DefaultDataTypeOptions<T> {
  /**
   * The name of the html attribute the value should be read from.
   */
  attributeName?: string;

  /**
   * The default value.
   */
  defaultValue?: T | { (): T };

  /**
   * The name of the option the value should be read from.
   */
  optionName?: string;
}

export type DataTypeOptions<T> =
  | AnyDataTypeOptions
  | BoolDataTypeOptions
  | ClassDataTypeOptions<T>
  | ElementDataTypeOptions
  | ElementsDataTypeOptions
  | EnumDataTypeOptions
  | IntDataTypeOptions
  | NumberDataTypeOptions
  | ObjectDataTypeOptions
  | OwnerDataTypeOptions
  | StringDataTypeOptions;

export default function createDataType<T>(options: DataTypeOptions<T>) {
  switch (options.type) {
    case 'any':
      return anyDataType(options);
    case 'bool':
      return boolDataType(options);
    case 'class':
      return classDataType(options);
    case 'element':
      return elementDataType(options);
    case 'elements':
      return elementsDataType(options);
    case 'enum':
      return enumDataType(options);
    case 'int':
      return intDataType(options);
    case 'number':
      return numberDataType(options);
    case 'object':
      return objectDataType(options);
    case 'owner':
      return ownerDataType(options);
    case 'string':
      return stringDataType(options);
  }

  throw new Error('Unknown data type.');
}
