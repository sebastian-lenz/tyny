const valueType = {
    add: (a, b) => a + b,
    clone: (value) => value,
    fromArray: (values) => values[0],
    length: (value) => Math.abs(value),
    origin: () => 0,
    scale: (value, scale) => value * scale,
    subtract: (a, b) => a - b,
    toArray: (value) => [value],
};
export function numericValueType(initialValue) {
    if (typeof initialValue !== 'number') {
        return undefined;
    }
    return valueType;
}
