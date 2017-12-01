import { memoize } from 'tyny-utils';

import { MaybeValueType, ValueType } from './index';

export type Vector = {
  [field: string]: number;
};

export const knownVectors: string[][] = [
  ['x', 'y', 'z', 'w'],
  ['x', 'y', 'z'],
  ['x', 'y'],
  ['r', 'g', 'b', 'a'],
  ['r', 'g', 'b'],
];

const vectorType = memoize(function vectorType(
  fields: string[]
): ValueType<Vector> {
  const length = fields.length;
  const vector = (callback: (field: string, index: number) => number) => {
    const vector: Vector = {};
    for (let index = 0; index < length; index++) {
      const field = fields[index];
      vector[field] = callback(field, index);
    }
    return vector;
  };

  return {
    add: (a: Vector, b: Vector): Vector => vector(field => a[field] + b[field]),
    clone: (value: Vector): Vector => vector(field => value[field]),
    fromArray: (values: number[]): Vector =>
      vector((field, index) => values[index]),
    length: (value: Vector): number =>
      Math.sqrt(
        fields.reduce((sum, field) => sum + value[field] * value[field], 0)
      ),
    origin: (): Vector => vector(field => 0),
    scale: (value: Vector, scale: number): Vector =>
      vector(field => value[field] * scale),
    subtract: (a: Vector, b: Vector): Vector =>
      vector(field => a[field] - b[field]),
    toArray: (value: Vector): number[] =>
      fields.reduce((array, field) => [...array, value[field]], [] as number[]),
  };
});

function vectorFields(value: any): string[] | undefined {
  if (typeof value !== 'object') {
    return undefined;
  }

  return knownVectors.find(fields =>
    fields.every(field => field in value && typeof value[field] === 'number')
  );
}

export default function vectorValueType(initialValue: any): MaybeValueType {
  const fields = vectorFields(initialValue);
  if (!fields) {
    return undefined;
  }

  return vectorType(fields);
}
