import defineProperties from './utils/defineProperties';

/**
 * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */
defineProperties(Array.prototype, {
  find: function(predicate: Function): any {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }

    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }

    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];

    for (let index = 0; index < length; index++) {
      const value = list[index];
      if (predicate.call(thisArg, value, index, list)) {
        return value;
      }
    }

    return undefined;
  },
  findIndex: function(predicate: Function): number {
    if (this == null) {
      throw new TypeError(
        'Array.prototype.findIndex called on null or undefined'
      );
    }

    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }

    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];

    for (let index = 0; index < length; index++) {
      const value = list[index];
      if (predicate.call(thisArg, value, index, list)) {
        return index;
      }
    }

    return -1;
  },
});

declare global {
  interface Array<T> {
    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find<S extends T>(
      predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
      thisArg?: any
    ): S | undefined;
    find(
      predicate: (value: T, index: number, obj: T[]) => boolean,
      thisArg?: any
    ): T | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(
      predicate: (value: T, index: number, obj: T[]) => boolean,
      thisArg?: any
    ): number;
  }
}
