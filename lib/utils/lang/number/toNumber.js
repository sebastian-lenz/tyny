export function toNumber(value) {
    var number = Number(value);
    return !isNaN(number) ? number : false;
}
