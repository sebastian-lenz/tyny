const { toString } = Object.prototype;

export function isPlainObject(obj: any): obj is Object {
  return toString.call(obj) === '[object Object]';
}
