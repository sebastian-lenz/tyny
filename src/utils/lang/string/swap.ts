export function swap(value: string, a: string, b: string): string {
  return value.replace(new RegExp(`${a}|${b}`, 'g'), (match) =>
    match === a ? b : a
  );
}
