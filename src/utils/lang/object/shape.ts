import { isObject } from './isObject';

export type HasAttribute<Key extends string, Type> = {
  [K in Key]: Type;
};

function has<Type>(target: string) {
  function has<Key extends string>(
    obj: Object,
    key: Key,
    optional?: boolean,
    validate?: (value: Type) => boolean
  ): obj is HasAttribute<Key, Type>;

  function has<Key extends string>(
    obj: Object,
    key: Key,
    optional: true,
    validate?: (value: Type) => boolean
  ): obj is HasAttribute<Key, Type | undefined>;

  function has<Key extends string>(
    obj: Object,
    key: Key,
    optional?: boolean,
    validate?: (value: Type) => boolean
  ): obj is HasAttribute<Key, Type> {
    const value = (obj as any)[key];
    const type = Array.isArray(value) ? 'array' : typeof value;

    return (
      (type === target && (validate ? validate(value) : true)) ||
      (optional === true && type === 'undefined')
    );
  }

  return has;
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
    optional?: boolean,
    validate?: (value: Array<any>) => boolean
  ): Shape {
    this.$result &&= hasArray(this.value, key, optional, validate);
    return this;
  }

  boolean(
    key: string,
    optional?: boolean,
    validate?: (value: boolean) => boolean
  ): Shape {
    this.$result &&= hasBoolean(this.value, key, optional, validate);
    return this;
  }

  enum<T>(
    key: string,
    values: Array<T>,
    optional?: boolean,
    validate?: (value: T) => boolean
  ) {
    const value = (this.value as any)[key];
    const matches = values.some((v) => v === value);

    this.$result &&=
      (matches && (validate ? validate(value) : true)) ||
      (optional === true && typeof value === 'undefined');

    return this;
  }

  number(
    key: string,
    optional?: boolean,
    validate?: (value: number) => boolean
  ): Shape {
    this.$result &&= hasNumber(this.value, key, optional, validate);
    return this;
  }

  object(
    key: string,
    optional?: boolean,
    validate?: (value: object) => boolean
  ): Shape {
    this.$result &&= hasObject(this.value, key, optional, validate);
    return this;
  }

  shape(
    key: string,
    validate: (value: Shape) => Shape,
    optional?: boolean
  ): Shape {
    return this.object(
      key,
      optional,
      (value) => validate(Shape.for(value)).isValid
    );
  }

  shapes(
    key: string,
    validate: (value: Shape) => Shape,
    optional?: boolean
  ): Shape {
    return this.array(key, optional, (value) =>
      value.every((value) => validate(Shape.for(value)).isValid)
    );
  }

  string(
    key: string,
    optional?: boolean,
    validate?: (value: string) => boolean
  ): Shape {
    this.$result &&= hasString(this.value, key, optional, validate);
    return this;
  }

  static for(value: any) {
    return new Shape(value);
  }
}
