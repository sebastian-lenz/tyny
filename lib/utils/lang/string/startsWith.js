const proto = String.prototype;
const startsWithFn = proto.startsWith ||
    function (search) {
        return this.lastIndexOf(search, 0) === 0;
    };
export function startsWith(str, search) {
    return startsWithFn.call(str, search);
}
