let idCounter: number = 0;

export default function uniqueId(prefix?: string): string {
  let id = ++idCounter + '';
  return prefix ? `${prefix}${id}` : id;
}
