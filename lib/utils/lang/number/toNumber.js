export function toNumber(value) {
    const number = Number(value);
    return !isNaN(number) ? number : false;
}
