function isFromVelocityValues(value) {
    return typeof value === 'object' && 'velocity' in value;
}
export function toMomentumValues(map) {
    return Object.keys(map).reduce(function (result, key) {
        var value = map[key];
        if (isFromVelocityValues(value)) {
            result[key] = {
                initialValue: value.from,
                initialVelocity: value.velocity,
                maxValue: value.max,
                minValue: value.min,
            };
        }
        else {
            result[key] = {
                initialVelocity: value,
            };
        }
        return result;
    }, {});
}
