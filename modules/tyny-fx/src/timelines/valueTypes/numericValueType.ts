import { MaybeValueType, ValueType } from './index';

const valueType: ValueType<number> = {
  add: (a: number, b: number): number => a + b,
  clone: (value: number): number => value,
  fromArray: (values: number[]): number => values[0],
  length: (value: number): number => Math.abs(value),
  origin: (): number => 0,
  scale: (value: number, scale: number): number => value * scale,
  subtract: (a: number, b: number): number => a - b,
  toArray: (value: number): number[] => [value],
};

export default function numericValueType(initialValue: any): MaybeValueType {
  if (typeof initialValue !== 'number') {
    return undefined;
  }

  return valueType;
}
