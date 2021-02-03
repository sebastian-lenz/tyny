import { dasherize, isHtmlElement } from 'tyny-utils';

import { toBoolean } from './initializers/dataTypes/bool';
import { toEnum } from './initializers/dataTypes/enum';
import { toInteger } from './initializers/dataTypes/int';
import { toNumber } from './initializers/dataTypes/number';
import { toString } from './initializers/dataTypes/string';
import createElement, { CreateElementOptions } from './utils/createElement';

import View from './View';

export type Source = Object | Element;

export interface Reader {
  getValue(name: string, options: ArgOptions): any;
  hasValue(name: string, options: ArgOptions): boolean;
}

export class AttributeReader implements Reader {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  getValue(name: string, options: ArgOptions): any {
    const { attribute = `data-${dasherize(name)}` } = options;
    return this.element.getAttribute(attribute);
  }

  hasValue(name: string, options: ArgOptions): boolean {
    const { attribute = `data-${dasherize(name)}` } = options;
    return this.element.hasAttribute(attribute);
  }
}

export class ObjectReader implements Reader {
  object: any;

  constructor(object: any) {
    this.object = object;
  }

  getValue(name: string, options: ArgOptions): any {
    const { property = name } = options;
    return this.object[property];
  }

  hasValue(name: string, options: ArgOptions): boolean {
    const { property = name } = options;
    return property in this.object;
  }
}

export interface ArgOptions<T = any> {
  attribute?: string;
  defaultValue?: T | { (): T };
  property?: string;
  name: string;
}

export type Safe<T extends ArgOptions<U> = ArgOptions<U>, U = any> = T & {
  defaultValue: U | { (): U };
};

export interface EnumArgOptions<T> extends ArgOptions<T[keyof T]> {
  enum: T;
}

export interface InstanceArgOptions<T> extends ArgOptions<T> {
  ctor: { new (data: any): T };
}

export default class Args {
  readers: Reader[];
  view: View | undefined;

  constructor(...sources: Source[]) {
    this.readers = sources.map(source => {
      if (isHtmlElement(source)) {
        return new AttributeReader(source);
      }

      return new ObjectReader(source);
    });
  }

  read<T>(options: ArgOptions<T>): T | undefined {
    const { defaultValue, name } = options;
    const { readers } = this;

    for (let index = 0; index < readers.length; index++) {
      const reader = readers[index];
      if (reader.hasValue(name, options)) {
        return reader.getValue(name, options);
      }
    }

    return typeof defaultValue == 'function' ? defaultValue() : defaultValue;
  }

  bool(options: ArgOptions<boolean>): boolean {
    return toBoolean(this.read(options));
  }

  element<T extends HTMLElement>(
    options: ArgOptions<string | T> & CreateElementOptions
  ): T | undefined {
    const value = this.read(options);
    if (isHtmlElement(value)) {
      return value;
    }

    const { view } = this;
    if (view) {
      if (typeof value === 'string') {
        const element = view.query(value);
        if (element) {
          return <T>element;
        }
      }

      if (options.tagName) {
        return <T>createElement({
          attributes: options.attributes,
          appendTo: view.element,
          className: options.className,
          tagName: options.tagName,
        });
      }
    }

    return undefined;
  }

  enum<T>(options: Safe<EnumArgOptions<T>>): T[keyof T];
  enum<T>(options: EnumArgOptions<T>): T[keyof T] | undefined;
  enum<T>(options: EnumArgOptions<T>): T[keyof T] | undefined {
    const result = this.read(options);
    return result === undefined ? result : toEnum(options.enum, result);
  }

  instance<T>(options: InstanceArgOptions<T>): T {
    const { ctor } = options;
    const value = this.read(options);
    return value instanceof ctor ? value : new ctor(value);
  }

  int(options: Safe<ArgOptions<number>>): number;
  int(options: ArgOptions<number>): number | undefined;
  int(options: ArgOptions<number>): number | undefined {
    const result = this.read(options);
    return result === undefined ? result : toInteger(result);
  }

  number(options: Safe<ArgOptions<number>>): number;
  number(options: ArgOptions<number>): number | undefined;
  number(options: ArgOptions<number>): number | undefined {
    const result = this.read(options);
    return result === undefined ? undefined : toNumber(result);
  }

  string(options: Safe<ArgOptions<string>>): string;
  string(options: ArgOptions<string>): string | undefined;
  string(options: ArgOptions<string>): string | undefined {
    const result = this.read(options);
    return result === undefined ? result : toString(result);
  }
}
