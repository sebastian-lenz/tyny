export function uniqueBy(array, prop) {
    var seen = new Set();
    return array.filter(function (_a) {
        var _b = prop, check = _a[_b];
        return (seen.has(check) ? false : seen.add(check) || true);
    } // IE 11 does not return the Set object
    );
}
