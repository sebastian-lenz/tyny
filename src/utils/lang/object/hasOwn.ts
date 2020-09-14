const { hasOwnProperty } = Object.prototype;

export function hasOwn(obj: any, key: string | number | symbol): boolean {
  return hasOwnProperty.call(obj, key);
}
