const proto = String.prototype;
const endsWithFn =
  proto.endsWith ||
  function (this: string, search: string): boolean {
    return this.substr(-search.length) === search;
  };

export function endsWith(str: string, search: string): boolean {
  return endsWithFn.call(str, search);
}
