import { __assign } from "tslib";
var unitRegexp = /^(\d+)\s*(%|ch|cm|em|ex|mm|in|pc|pt|px|rem|vh|vmax|vmin|vw)$/;
function parse(value) {
    if (typeof value === 'string') {
        var matches = unitRegexp.exec(value);
        if (matches) {
            return {
                unit: matches[2],
                value: parseFloat(matches[1]),
            };
        }
    }
    return undefined;
}
export function unitConverter(accessor) {
    var initialValue = accessor.getValue();
    var unitValue = parse(initialValue);
    if (!unitValue) {
        return accessor;
    }
    var unit = unitValue.unit;
    function convert(value) {
        if (typeof value === 'number') {
            return value;
        }
        var parsed = parse(value);
        if (!parsed) {
            throw new Error("Not a valid unit value: '" + value + "'.");
        }
        else if (parsed.unit !== unit) {
            console.warn("Unit mismatch: Expected '" + unit + "' but got '" + parsed.unit + "'.");
        }
        return parsed.value;
    }
    return __assign(__assign({}, accessor), { convert: convert, getValue: function () { return convert(accessor.getValue()); }, setValue: function (value) { return accessor.setValue("" + value + unit); } });
}
