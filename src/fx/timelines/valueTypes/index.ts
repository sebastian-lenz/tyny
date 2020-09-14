import { numericValueType } from './numericValueType';
import { vectorValueType } from './vectorValueType';

export type ValueTypeSource = string | number | object;

export type ValueType<T = any> = {
  add(a: T, b: T): T;
  clone(value: T): T;
  fromArray(values: number[]): T;
  length(value: T): number;
  origin(): T;
  scale(value: T, scale: number): T;
  subtract(a: T, b: T): T;
  toArray(value: T): number[];
};

export type MaybeValueType<T = any> = ValueType<T> | undefined;

export type ValueTypeFactory<T = any> = (value: T) => MaybeValueType<T>;

export const valueTypeFactories: ValueTypeFactory[] = [
  numericValueType,
  vectorValueType,
];

export function createValueType<T>(value: T): MaybeValueType<T> {
  return valueTypeFactories.reduce(
    (valueType, factory) => (valueType ? valueType : factory(value)),
    undefined as MaybeValueType<T>
  );
}
