var proto = String.prototype;
var startsWithFn = proto.startsWith ||
    function (search) {
        return this.lastIndexOf(search, 0) === 0;
    };
export function startsWith(str, search) {
    return startsWithFn.call(str, search);
}
