const proto = String.prototype;
const startsWithFn =
  proto.startsWith ||
  function (this: string, search: string): boolean {
    return this.lastIndexOf(search, 0) === 0;
  };

export function startsWith(str: string, search: string): boolean {
  return startsWithFn.call(str, search);
}
