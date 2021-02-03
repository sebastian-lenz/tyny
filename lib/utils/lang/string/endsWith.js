var proto = String.prototype;
var endsWithFn = proto.endsWith ||
    function (search) {
        return this.substr(-search.length) === search;
    };
export function endsWith(str, search) {
    return endsWithFn.call(str, search);
}
