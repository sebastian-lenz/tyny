export function isObject(obj: any): obj is tyny.AnyObject {
  return obj !== null && typeof obj === 'object';
}
