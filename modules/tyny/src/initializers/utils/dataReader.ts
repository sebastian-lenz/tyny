import { identity } from 'tyny-utils';

import View, { ViewOptions } from '../../View';

export interface DataReader<T> {
  (view: View, viewOptions: ViewOptions): T | undefined;
}

export interface DataReaderOptions<T> {
  attributeName?: string;
  defaultValue?: T | { (): T };
  optionName?: string;
}

export interface DataReaderConverter<T> {
  (value: any, view: View, viewOptions: ViewOptions): T;
}

export default function dataReader<T>(
  options: DataReaderOptions<T>,
  converter: DataReaderConverter<T> = identity
): DataReader<T> {
  const { attributeName, defaultValue, optionName } = options;

  return function(view: View, viewOptions: ViewOptions): T | undefined {
    const { element } = viewOptions;
    let value: T | undefined;

    if (optionName && optionName in viewOptions) {
      value = converter((<any>viewOptions)[optionName], view, viewOptions);
      if (value != void 0) {
        return value;
      }
    }

    if (element && attributeName && element.hasAttribute(attributeName)) {
      value = converter(element.getAttribute(attributeName), view, viewOptions);
      if (value != void 0) {
        return value;
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  };
}
