import { dasherize } from '../utils/lang/string/dasherize';
import { isElement } from '../utils/dom/misc/isElement';
import { toBoolean } from '../utils/lang/misc/toBoolean';
import { toEnum } from '../utils/lang/misc/toEnum';
import { toFloat } from '../utils/lang/number/toFloat';
import { toInt } from '../utils/lang/number/toInt';
import {
  createElement,
  CreateElementOptions,
} from '../utils/dom/node/createElement';

import type { View, ViewOptions } from './View';

export interface Param<TValue = any> {
  attribute?: string;
  defaultValue?: TValue | { (): TValue };
  property?: string;
  name: string;
}

export type SafeParam<
  TParam extends Param<TValue> = Param<any>,
  TValue = any
> = TParam & {
  defaultValue: TValue | { (): TValue };
};

export interface EnumParam<TValue = any> extends Param<TValue[keyof TValue]> {
  enum: TValue;
}

export interface InstanceParam<TValue = any> extends Param<TValue> {
  ctor: { new (data: any): TValue };
}

export interface ParamsReader {
  getValue(name: string, options: Param): any;
  hasValue(name: string, options: Param): boolean;
}

export class ParamsAttributeReader implements ParamsReader {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  getValue(name: string, options: Param): any {
    const { attribute = `data-${dasherize(name)}` } = options;
    return this.element.getAttribute(attribute);
  }

  hasValue(name: string, options: Param): boolean {
    const { attribute = `data-${dasherize(name)}` } = options;
    return this.element.hasAttribute(attribute);
  }
}

export class ParamsObjectReader implements ParamsReader {
  object: any;

  constructor(object: any) {
    this.object = object;
  }

  getValue(name: string, options: Param): any {
    const { property = name } = options;
    return property in this.object ? this.object[property] : null;
  }

  hasValue(name: string, options: Param): boolean {
    const { property = name } = options;
    return property in this.object;
  }
}

export class Params {
  readonly readers: Array<ParamsReader>;
  readonly view: View;

  constructor(view: View, options: ViewOptions) {
    this.view = view;
    this.readers = [
      new ParamsObjectReader(options),
      new ParamsAttributeReader(view.el),
    ];
  }

  read<T>(options: Param<T>): T | null {
    const { defaultValue, name } = options;
    const { readers } = this;

    for (let index = 0; index < readers.length; index++) {
      const reader = readers[index];
      if (reader.hasValue(name, options)) {
        return reader.getValue(name, options);
      }
    }

    return typeof defaultValue === 'function'
      ? (defaultValue as Function).call(this.view)
      : defaultValue;
  }

  bool(options: Param<boolean>): boolean {
    return toBoolean(this.read(options));
  }

  element<T extends HTMLElement>(
    options: Param<string | T> & { defaultValue: T | { (): T } }
  ): T;

  element<T extends HTMLElement>(
    options: Param<string | T> & CreateElementOptions & { tagName: string }
  ): T;

  element<T extends HTMLElement>(
    options: Param<string | T> & CreateElementOptions
  ): T | null;

  element<T extends HTMLElement>(
    options: Param<string | T> & CreateElementOptions
  ): T | null {
    const value = this.read(options);
    if (isElement(value)) {
      return value as T;
    }

    const { view } = this;
    if (view) {
      if (typeof value === 'string') {
        const element = view.find(value);
        if (element) {
          return <T>element;
        }
      }

      if (options.tagName) {
        return <T>createElement({
          attributes: options.attributes,
          appendTo: options.appendTo || view.el,
          className: options.className,
          tagName: options.tagName,
        });
      }
    }

    return null;
  }

  enum<T>(options: SafeParam<EnumParam<T>>): T[keyof T];
  enum<T>(options: EnumParam<T>): T[keyof T] | null;
  enum<T>(options: EnumParam<T>): T[keyof T] | null {
    const result = this.read(options);
    return result === null ? result : toEnum(options.enum, result);
  }

  instance<T>(options: InstanceParam<T>): T {
    const { ctor } = options;
    const value = this.read(options);
    return value instanceof ctor ? value : new ctor(value);
  }

  int(options: SafeParam<Param<number>>): number;
  int(options: Param<number>): number | null;
  int(options: Param<number>): number | null {
    const result = this.read(options);
    return result === null ? result : toInt(result);
  }

  number(options: SafeParam<Param<number>>): number;
  number(options: Param<number>): number | null;
  number(options: Param<number>): number | null {
    const result = this.read(options);
    return result === null ? null : toFloat(result);
  }

  string(options: SafeParam<Param<string>>): string;
  string(options: Param<string>): string | null;
  string(options: Param<string>): string | null {
    const result = this.read(options);
    return result === null ? result : `${result}`;
  }
}
