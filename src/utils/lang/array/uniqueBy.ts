export function uniqueBy<T, K extends keyof T>(array: Array<T>, prop: K) {
  const seen = new Set();
  return array.filter(
    ({ [prop]: check }) => (seen.has(check) ? false : seen.add(check) || true) // IE 11 does not return the Set object
  );
}
