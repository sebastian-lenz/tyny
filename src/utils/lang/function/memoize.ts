export function memoize<T extends Function>(func: T, hasher?: Function): T {
  const cache: any = {};

  return function (this: any, key: any): any {
    var address = '' + (hasher ? hasher(this, arguments) : key);
    if (!cache.hasOwnProperty(address)) {
      cache[address] = func.apply(this, arguments);
    }

    return cache[address];
  } as any;
}
