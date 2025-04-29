import { hasOwn } from './hasOwn';
import { isObject } from './isObject';

export function get<T>(obj: any, key: string | number | symbol, fallback: T): T;
export function get<T>(obj: any, key: string | number | symbol): any;

export function get<T = any>(
  obj: any,
  key: string | number | symbol,
  fallback: T | null = null
): T | null {
  if (!isObject(obj) || !hasOwn(obj, key)) {
    return fallback;
  }

  const value = (obj as any)[key];
  return typeof fallback === typeof value ? value : fallback;
}
