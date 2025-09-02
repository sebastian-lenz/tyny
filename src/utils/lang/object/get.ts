import { hasOwn } from './hasOwn';
import { isObject } from './isObject';

export interface TypeMap {
  string: string;
  number: number;
  bigint: bigint;
  boolean: boolean;
  symbol: Symbol;
  undefined: undefined;
  object: Object;
  function: Function;
}

export type TypeName = keyof TypeMap;

export function get<T>(obj: any, key: string | number | symbol): any;

export function get<T>(obj: any, key: string | number | symbol, fallback: T): T;

export function get<T extends TypeName>(
  obj: any,
  key: string | number | symbol,
  fallback: TypeMap[T],
  type: T
): TypeMap[T];

export function get<T extends TypeName>(
  obj: any,
  key: string | number | symbol,
  fallback: null,
  type: T
): TypeMap[T] | null;

export function get<T = any>(
  obj: any,
  key: string | number | symbol,
  fallback: T | null = null,
  type: TypeName | null = null
): T | null {
  if (!isObject(obj) || !hasOwn(obj, key)) {
    return fallback;
  }

  const value = (obj as any)[key];
  if (type === null && fallback !== null) type = typeof fallback;
  return type == null || type === typeof value ? value : fallback;
}
