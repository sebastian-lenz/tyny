export function propertyMap(map, callback) {
    return Object.keys(map).map((key) => callback(key, map[key]));
}
