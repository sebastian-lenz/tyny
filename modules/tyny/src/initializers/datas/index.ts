import AnyData, { AnyDataOptions } from './AnyData';
import BooleanData, { BooleanDataOptions } from './BooleanData';
import ClassData, { ClassDataOptions } from './ClassData';
import ElementData, { ElementDataOptions } from './ElementData';
import EnumData, { EnumDataOptions } from './EnumData';
import IntData, { IntDataOptions } from './IntData';
import JsonData, { JsonDataOptions } from './JsonData';
import NumberData, { NumberDataOptions } from './NumberData';
import OwnerData, { OwnerDataOptions } from './OwnerData';
import StringData, { StringDataOptions } from './StringData';

import { getInitializer } from '../index';

export type DataOptions =
  | AnyDataOptions
  | BooleanDataOptions
  | ClassDataOptions
  | ElementDataOptions
  | EnumDataOptions
  | IntDataOptions
  | JsonDataOptions
  | NumberDataOptions
  | OwnerDataOptions
  | StringDataOptions;

export default function createDataInitializer(
  owner: object,
  property: string,
  options: DataOptions
) {
  const name = `data::${property}`;
  const initializer = getInitializer(owner, name, () => {
    switch (options.type) {
      case 'any':
        return new AnyData(property, options);
      case 'bool':
        return new BooleanData(property, options);
      case 'class':
        return new ClassData(property, options);
      case 'element':
        return new ElementData(property, options);
      case 'enum':
        return new EnumData(property, options);
      case 'int':
        return new IntData(property, options);
      case 'json':
        return new JsonData(property, options);
      case 'number':
        return new NumberData(property, options);
      case 'owner':
        return new OwnerData(property, options);
      case 'string':
        return new StringData(property, options);
    }
  });
}
