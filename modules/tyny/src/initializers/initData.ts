import { dasherize, trimStart } from 'tyny-utils';

import { Initializer } from './index';
import View, { ViewOptions } from '../View';
import createDataType, { DataTypeOptions } from './dataTypes/index';

export type InitDataOptions<T> = DataTypeOptions<T>;

export default function initData<T>(
  propertyName: string,
  options: DataTypeOptions<T>
): Initializer {
  const name = trimStart(propertyName, '_');
  const resolvedOptions: DataTypeOptions<T> = {
    attributeName: `data-${dasherize(name)}`,
    optionName: name,
    ...options,
  };

  const { optionName } = resolvedOptions;
  const dataType = createDataType(resolvedOptions);

  return function(view: View, viewOptions: ViewOptions) {
    const value = dataType(view, viewOptions);
    (<any>view)[propertyName] = value;

    if (optionName) {
      (<any>options)[optionName] = value;
    }
  };
}
