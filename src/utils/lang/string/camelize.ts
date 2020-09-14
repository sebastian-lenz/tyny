const camelizeRe = /-(\w)/g;

export function camelize(str: string): string {
  return str.replace(camelizeRe, (_, value) =>
    value ? value.toUpperCase() : ''
  );
}
