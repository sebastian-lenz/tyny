var cache = {};
var regExp = /([a-z\d])([A-Z])/g;
export function hyphenate(value) {
    if (!(value in cache)) {
        cache[value] = value.replace(regExp, '$1-$2').toLowerCase();
    }
    return cache[value];
}
