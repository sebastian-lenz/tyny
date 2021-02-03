const unitRegexp = /^(\d+)\s*(%|ch|cm|em|ex|mm|in|pc|pt|px|rem|vh|vmax|vmin|vw)$/;
function parse(value) {
    if (typeof value === 'string') {
        const matches = unitRegexp.exec(value);
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
    const initialValue = accessor.getValue();
    const unitValue = parse(initialValue);
    if (!unitValue) {
        return accessor;
    }
    const { unit } = unitValue;
    function convert(value) {
        if (typeof value === 'number') {
            return value;
        }
        const parsed = parse(value);
        if (!parsed) {
            throw new Error(`Not a valid unit value: '${value}'.`);
        }
        else if (parsed.unit !== unit) {
            console.warn(`Unit mismatch: Expected '${unit}' but got '${parsed.unit}'.`);
        }
        return parsed.value;
    }
    return Object.assign(Object.assign({}, accessor), { convert, getValue: () => convert(accessor.getValue()), setValue: (value) => accessor.setValue(`${value}${unit}`) });
}
