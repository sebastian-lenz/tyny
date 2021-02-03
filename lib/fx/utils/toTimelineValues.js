function isFromToValues(value) {
    return typeof value === 'object' && 'to' in value;
}
export function toTimelineValues(map) {
    return Object.keys(map).reduce((result, key) => {
        const value = map[key];
        if (isFromToValues(value)) {
            result[key] = { initialValue: value.from, targetValue: value.to };
        }
        else {
            result[key] = { targetValue: value };
        }
        return result;
    }, {});
}
