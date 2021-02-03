const camelizeRe = /-(\w)/g;
export function camelize(str) {
    return str.replace(camelizeRe, (_, value) => value ? value.toUpperCase() : '');
}
