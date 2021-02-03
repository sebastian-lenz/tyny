export function swap(value, a, b) {
    return value.replace(new RegExp(`${a}|${b}`, 'g'), (match) => match === a ? b : a);
}
