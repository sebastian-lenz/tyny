export function each<T>(
  obj: T,
  cb: { (value: any, key: string): void | boolean }
) {
  for (const key in obj) {
    if (false === cb(obj[key], key)) {
      return false;
    }
  }

  return true;
}
