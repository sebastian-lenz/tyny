import { memoize } from '../../../utils/lang/function/memoize';
export const knownVectors = [
    ['x', 'y', 'z', 'w'],
    ['x', 'y', 'z'],
    ['x', 'y'],
    ['r', 'g', 'b', 'a'],
    ['r', 'g', 'b'],
];
const vectorType = memoize(function vectorType(fields) {
    const length = fields.length;
    const vector = (callback) => {
        const vector = {};
        for (let index = 0; index < length; index++) {
            const field = fields[index];
            vector[field] = callback(field, index);
        }
        return vector;
    };
    return {
        add: (a, b) => vector((field) => a[field] + b[field]),
        clone: (value) => vector((field) => value[field]),
        fromArray: (values) => vector((field, index) => values[index]),
        length: (value) => Math.sqrt(fields.reduce((sum, field) => sum + value[field] * value[field], 0)),
        origin: () => vector((field) => 0),
        scale: (value, scale) => vector((field) => value[field] * scale),
        subtract: (a, b) => vector((field) => a[field] - b[field]),
        toArray: (value) => fields.reduce((array, field) => [...array, value[field]], []),
    };
});
function vectorFields(value) {
    if (typeof value !== 'object') {
        return undefined;
    }
    return knownVectors.find((fields) => fields.every((field) => field in value && typeof value[field] === 'number'));
}
export function vectorValueType(initialValue) {
    const fields = vectorFields(initialValue);
    if (!fields) {
        return undefined;
    }
    return vectorType(fields);
}
