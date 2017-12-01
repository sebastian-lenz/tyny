export interface PropertyMap<T> {
  [name: string]: T;
}

export interface PropertyMapCallback<T, U> {
  (key: string, value: T): U;
}

export default function propertyMap<T, U>(
  map: PropertyMap<T>,
  callback: PropertyMapCallback<T, U>
): U[] {
  return Object.keys(map).map(key => callback(key, map[key]));
}
