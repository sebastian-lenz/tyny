export function values<T>(value: tyny.Map<T>): Array<T>;

export function values<T = any>(value: any): Array<T> {
  const result: Array<T> = [];
  for (const key in value) {
    result.push(value[key]);
  }

  return result;
}
