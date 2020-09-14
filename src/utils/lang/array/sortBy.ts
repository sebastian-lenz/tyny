export function sortBy<T, K extends keyof T>(array: Array<T>, prop: K) {
  return array.sort(({ [prop]: propA = 0 }, { [prop]: propB = 0 }) =>
    propA > propB ? 1 : propB > propA ? -1 : 0
  );
}
