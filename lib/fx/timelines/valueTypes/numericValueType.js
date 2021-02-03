var valueType = {
    add: function (a, b) { return a + b; },
    clone: function (value) { return value; },
    fromArray: function (values) { return values[0]; },
    length: function (value) { return Math.abs(value); },
    origin: function () { return 0; },
    scale: function (value, scale) { return value * scale; },
    subtract: function (a, b) { return a - b; },
    toArray: function (value) { return [value]; },
};
export function numericValueType(initialValue) {
    if (typeof initialValue !== 'number') {
        return undefined;
    }
    return valueType;
}
