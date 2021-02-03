const proto = String.prototype;
const endsWithFn = proto.endsWith ||
    function (search) {
        return this.substr(-search.length) === search;
    };
export function endsWith(str, search) {
    return endsWithFn.call(str, search);
}
