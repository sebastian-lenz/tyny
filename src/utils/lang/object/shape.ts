import { isObject } from './isObject';

export type HasAttribute<Key extends string, Type> = {
  [K in Key]: Type;
};

export interface HasOptions {
  nullable?: boolean;
  optional?: boolean;
}
type Validator<Type> = (value: Type) => boolean;

interface HasFunction<Type> {
  <Key extends string>(
    obj: Object,
    key: Key,
    options: { optional: true },
    validate?: Validator<Type>
  ): obj is HasAttribute<Key, Type | undefined>;

  <Key extends string>(
    obj: Object,
    key: Key,
    options: { nullable: true },
    validate?: Validator<Type>
  ): obj is HasAttribute<Key, Type | null>;

  <Key extends string>(
    obj: Object,
    key: Key,
    options: { nullable: true; optional: true },
    validate?: Validator<Type>
  ): obj is HasAttribute<Key, Type | undefined | null>;

  <Key extends string>(
    obj: Object,
    key: Key,
    options?: HasOptions,
    validate?: Validator<Type>
  ): obj is HasAttribute<Key, Type>;
}

function has<Type>(target: string): HasFunction<Type> {
  return function has<Type, Key extends string>(
    obj: Object,
    key: Key,
    { nullable = false, optional = false }: HasOptions = {},
    validate?: (value: Type) => boolean
  ): obj is HasAttribute<Key, Type> {
    const value = (obj as any)[key];
    const type = typeOf(value);

    return (
      (type === target && (validate ? validate(value) : true)) ||
      (optional === true && type === 'undefined') ||
      (nullable === true && value === null)
    );
  };
}

export type Type =
  | 'array'
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'null'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined';

export function typeOf(value: any): Type {
  const result = typeof value;
  if (result === 'object') {
    if (value === null) {
      return 'null';
    } else if (Array.isArray(value)) {
      return 'array';
    }
  }

  return result;
}

export const hasArray = has<Array<any>>('array');
export const hasBoolean = has<boolean>('boolean');
export const hasNumber = has<number>('number');
export const hasObject = has<object>('object');
export const hasString = has<string>('string');

export class Shape {
  value: Object;
  $result: boolean;

  constructor(value: Object) {
    if (isObject(value)) {
      this.value = value;
      this.$result = true;
    } else {
      this.value = {};
      this.$result = false;
    }
  }

  get isValid() {
    return this.$result;
  }

  array(
    key: string,
    options?: HasOptions,
    validate?: (value: Array<any>) => boolean
  ): Shape {
    this.$result &&= hasArray(this.value, key, options, validate);
    return this;
  }

  boolean(
    key: string,
    options?: HasOptions,
    validate?: (value: boolean) => boolean
  ): Shape {
    this.$result &&= hasBoolean(this.value, key, options, validate);
    return this;
  }

  enum<T>(
    key: string,
    values: Array<T>,
    { optional = false, nullable = false }: HasOptions = {},
    validate?: (value: T) => boolean
  ) {
    const value = (this.value as any)[key];
    const matches = values.some((v) => v === value);

    this.$result &&=
      (matches && (validate ? validate(value) : true)) ||
      (optional === true && typeof value === 'undefined') ||
      (nullable === true && value === null);

    return this;
  }

  number(
    key: string,
    options?: HasOptions,
    validate?: (value: number) => boolean
  ): Shape {
    this.$result &&= hasNumber(this.value, key, options, validate);
    return this;
  }

  object(
    key: string,
    options?: HasOptions,
    validate?: (value: object) => boolean
  ): Shape {
    this.$result &&= hasObject(this.value, key, options, validate);
    return this;
  }

  shape(
    key: string,
    validate: (value: Shape) => Shape,
    options?: HasOptions
  ): Shape {
    return this.object(
      key,
      options,
      (value) => validate(Shape.for(value)).isValid
    );
  }

  shapes(
    key: string,
    validate: (value: Shape) => Shape,
    options?: HasOptions
  ): Shape {
    return this.array(key, options, (value) =>
      value.every((value) => validate(Shape.for(value)).isValid)
    );
  }

  string(
    key: string,
    options?: HasOptions,
    validate?: (value: string) => boolean
  ): Shape {
    this.$result &&= hasString(this.value, key, options, validate);
    return this;
  }

  static for(value: any) {
    return new Shape(value);
  }
}
