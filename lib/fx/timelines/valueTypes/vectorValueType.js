import { __spreadArrays } from "tslib";
import { memoize } from '../../../utils/lang/function/memoize';
export var knownVectors = [
    ['x', 'y', 'z', 'w'],
    ['x', 'y', 'z'],
    ['x', 'y'],
    ['r', 'g', 'b', 'a'],
    ['r', 'g', 'b'],
];
var vectorType = memoize(function vectorType(fields) {
    var length = fields.length;
    var vector = function (callback) {
        var vector = {};
        for (var index = 0; index < length; index++) {
            var field = fields[index];
            vector[field] = callback(field, index);
        }
        return vector;
    };
    return {
        add: function (a, b) {
            return vector(function (field) { return a[field] + b[field]; });
        },
        clone: function (value) { return vector(function (field) { return value[field]; }); },
        fromArray: function (values) {
            return vector(function (field, index) { return values[index]; });
        },
        length: function (value) {
            return Math.sqrt(fields.reduce(function (sum, field) { return sum + value[field] * value[field]; }, 0));
        },
        origin: function () { return vector(function (field) { return 0; }); },
        scale: function (value, scale) {
            return vector(function (field) { return value[field] * scale; });
        },
        subtract: function (a, b) {
            return vector(function (field) { return a[field] - b[field]; });
        },
        toArray: function (value) {
            return fields.reduce(function (array, field) { return __spreadArrays(array, [value[field]]); }, []);
        },
    };
});
function vectorFields(value) {
    if (typeof value !== 'object') {
        return undefined;
    }
    return knownVectors.find(function (fields) {
        return fields.every(function (field) { return field in value && typeof value[field] === 'number'; });
    });
}
export function vectorValueType(initialValue) {
    var fields = vectorFields(initialValue);
    if (!fields) {
        return undefined;
    }
    return vectorType(fields);
}
