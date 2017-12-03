import { identity } from 'tyny-utils';

import { toEnum } from '../initializers/dataTypes/enum';
import { toInteger } from '../initializers/dataTypes/int';
import { toNumber } from '../initializers/dataTypes/number';
import { toString } from '../initializers/dataTypes/string';

export type OptionType = 'enum' | 'int' | 'number' | 'string';
export type OptionConverter = (value: any) => any;
export type OptionMap = { [name: string]: any };

export interface OptionDefinition {
  convert?: OptionConverter;
  defaultValue?: any;
  name: string;
  type?: OptionType;
  values?: any;
}

function isOptionMap(value: any): value is OptionMap {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function toOptionMap(source: any): OptionMap {
  if (isOptionMap(source)) {
    return source;
  }

  if (typeof source !== 'string') {
    return {};
  }

  try {
    const result = JSON.parse(source);
    return isOptionMap(result) ? result : {};
  } catch (e) {}

  return source.split(';').reduce(
    (memo, arg) => {
      let [name, value] = arg.split('=', 2);
      if (name && value) memo[name.trim()] = value.trim();
      return memo;
    },
    {} as OptionMap
  );
}

function getConverter(option: OptionDefinition): OptionConverter {
  switch (option.type) {
    case 'enum':
      return toEnum(option.values);
    case 'int':
      return toInteger;
    case 'number':
      return toNumber;
    case 'string':
      return toString;
  }

  return identity;
}

function applyDefaults<T>(result: T, option: OptionDefinition): T {
  if (option.defaultValue) {
    (<any>result)[option.name] = option.defaultValue;
  }

  return result;
}

export default function parseConfig<T>(options: OptionDefinition[]) {
  const converters = options.map(option => ({
    ...option,
    lowerName: option.name.toLowerCase(),
    convert: option.convert || getConverter(option),
  }));

  return function(source: any): T {
    const result: T = options.reduce(applyDefaults, {} as T);
    const optionMap = toOptionMap(source);

    return Object.keys(optionMap).reduce((result, name) => {
      const lowerName = name.toLowerCase();
      const converter = converters.find(
        converter => converter.lowerName === lowerName
      );

      if (!converter) {
        console.warn(`Unknown option '${name}'.`);
        return result;
      }

      const value = converter.convert(optionMap[name]);
      if (value === undefined) {
        console.warn(`Invalid option value '${value}' for option '${name}'.`);
        return result;
      }

      (<any>result)[converter.name] = value;
      return result;
    }, result);
  };
}
