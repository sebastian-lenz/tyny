export function memoize(func, hasher) {
    const cache = {};
    return function (key) {
        var address = '' + (hasher ? hasher(this, arguments) : key);
        if (!cache.hasOwnProperty(address)) {
            cache[address] = func.apply(this, arguments);
        }
        return cache[address];
    };
}
