export function toInt(value: any): number {
  if (typeof value === 'string') {
    return parseInt(value);
  } else if (typeof value === 'number') {
    return Math.round(value);
  }

  return 0;
}
