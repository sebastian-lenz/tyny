var toString = Object.prototype.toString;
export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}
