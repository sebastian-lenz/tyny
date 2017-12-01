import { dasherize, trimStart } from 'tyny-utils';

import { Initializer } from './index';
import View, { ViewOptions } from '../View';

export interface DataOptions<ValueType> {
  // The name of the html attribute the value should be read from.
  attribute?: string;

  defaultValue?: ValueType | { (): ValueType };

  // The name of the option the value should be read from.
  option?: string;
}

export default class Data<
  ValueType = any,
  OptionsType extends DataOptions<ValueType> = DataOptions<ValueType>
> implements Initializer {
  // The name of the html attribute the value should be read from.
  attribute: string;

  // The default value of the option.
  defaultValue: ValueType | { (): ValueType };

  // The name of the option the value should be read from.
  option: string | undefined;

  // The name of the property the value should be stored to.
  property: string | undefined;

  /**
   * Option constructor.
   */
  constructor(property: string, options: OptionsType) {
    const name = trimStart(property, '_');
    this.option = name;
    this.attribute = 'data-' + dasherize(name);

    Object.assign(this, options);
    this.property = property;
  }

  /**
   * Invoke this initializer.
   */
  invoke(scope: View, options: ViewOptions) {
    const { option, property } = this;
    const value: ValueType = this.getValue(scope, options);

    if (property) {
      (<any>scope)[property] = value;
    }

    if (option) {
      (<any>options)[option] = value;
    }
  }

  /**
   * Convert the given option value.
   */
  convert(scope: View, value: any): ValueType | undefined {
    return <ValueType>value;
  }

  /**
   * Extract the value from the given view and options object.
   */
  getValue(scope: View, options: ViewOptions): ValueType {
    const { attribute, option } = this;
    const { element } = options;
    let value: ValueType | undefined = void 0;

    if (element && attribute && element.hasAttribute(attribute)) {
      value = this.convert(scope, element.getAttribute(attribute));
      if (value !== void 0) return value;
    }

    if (option && option in options) {
      value = this.convert(scope, (<any>options)[option]);
      if (value !== void 0) return value;
    }

    return this.getDefaultValue();
  }

  /**
   * Return this options default value.
   */
  getDefaultValue(): ValueType {
    const { defaultValue } = this;
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }
}
