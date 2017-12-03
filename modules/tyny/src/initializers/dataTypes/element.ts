import { isHtmlElement } from 'tyny-utils';

import { DataType, DefaultDataTypeOptions } from './index';
import View, { ViewOptions } from '../../View';
import createElement, { CreateElementOptions } from '../../utils/createElement';
import dataReader from '../utils/dataReader';

export interface ElementDataTypeOptions
  extends CreateElementOptions,
    DefaultDataTypeOptions<string | HTMLElement> {
  type: 'element';
}

export default function elementDataType(
  options: ElementDataTypeOptions
): DataType<HTMLElement | undefined> {
  const reader = dataReader(options);

  return function element(
    view: View,
    viewOptions: ViewOptions
  ): HTMLElement | undefined {
    const value = reader(view, viewOptions);
    if (isHtmlElement(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const element = view.element.querySelector(value);
      if (element) {
        return <HTMLElement>element;
      }
    }

    if (options.tagName) {
      return createElement({
        attributes: options.attributes,
        appendTo: view.element,
        className: options.className,
        tagName: options.tagName,
      });
    }

    return undefined;
  };
}
