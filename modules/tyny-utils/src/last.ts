export default function last<T>(list: ArrayLike<T> | undefined): T | undefined {
  return !list || !list.length ? undefined : list[list.length - 1];
}
