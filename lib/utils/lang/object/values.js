export function values(value) {
    var result = [];
    for (var key in value) {
        result.push(value[key]);
    }
    return result;
}
