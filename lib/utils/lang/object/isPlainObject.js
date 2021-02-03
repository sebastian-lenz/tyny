const { toString } = Object.prototype;
export function isPlainObject(obj) {
    return toString.call(obj) === '[object Object]';
}
