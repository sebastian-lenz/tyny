export function toArray<T extends Element>(
  value: HTMLCollectionOf<T>
): Array<T>;

export function toArray<T = any>(value: any): Array<T>;

export function toArray<T>(value: any): Array<T> {
  return Array.prototype.slice.call(value);
}
