export function propertyMap(map, callback) {
    return Object.keys(map).map(function (key) { return callback(key, map[key]); });
}
