export function toEnum<T extends Object>(
  enumType: T,
  value: any
): T[keyof T] | null {
  if (enumType.hasOwnProperty(value)) {
    return value;
  }

  if (typeof value === 'string') {
    value = value.toLowerCase();

    for (let key in enumType) {
      const enumValue = enumType[key];
      if (typeof enumValue === 'string') {
        if (enumValue.toLowerCase() === value.toLowerCase()) {
          return parseInt(key) as any;
        }
      } else if (value === enumValue) {
        return enumValue;
      }
    }
  }

  return null;
}
