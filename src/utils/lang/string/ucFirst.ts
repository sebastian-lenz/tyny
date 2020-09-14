export function ucFirst(value: string): string {
  return value.length ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}
