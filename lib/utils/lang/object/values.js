export function values(value) {
    const result = [];
    for (const key in value) {
        result.push(value[key]);
    }
    return result;
}
