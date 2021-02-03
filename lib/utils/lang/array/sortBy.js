export function sortBy(array, prop) {
    return array.sort(function (_a, _b) {
        var _c = prop, _d = _a[_c], propA = _d === void 0 ? 0 : _d;
        var _e = prop, _f = _b[_e], propB = _f === void 0 ? 0 : _f;
        return propA > propB ? 1 : propB > propA ? -1 : 0;
    });
}
