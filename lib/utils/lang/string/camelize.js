var camelizeRe = /-(\w)/g;
export function camelize(str) {
    return str.replace(camelizeRe, function (_, value) {
        return value ? value.toUpperCase() : '';
    });
}
