export function swap(value, a, b) {
    return value.replace(new RegExp(a + "|" + b, 'g'), function (match) {
        return match === a ? b : a;
    });
}
