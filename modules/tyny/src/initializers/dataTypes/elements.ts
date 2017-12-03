import { DataType, DefaultDataTypeOptions } from './index';
import View, { ViewOptions } from '../../View';
import dataReader from '../utils/dataReader';

export interface ElementsDataTypeOptions
  extends DefaultDataTypeOptions<string> {
  type: 'elements';
}

export default function elementsDataType(
  options: ElementsDataTypeOptions
): DataType<HTMLElement[]> {
  const reader = dataReader(options);

  return function elements(
    view: View,
    viewOptions: ViewOptions
  ): HTMLElement[] {
    const value = reader(view, viewOptions);
    const result: HTMLElement[] = [];

    if (typeof value === 'string') {
      const elements = view.element.querySelectorAll(value);
      for (let index = 0; index < elements.length; index++) {
        result.push(<HTMLElement>elements[index]);
      }
    }

    return result;
  };
}
