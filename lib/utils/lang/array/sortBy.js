export function sortBy(array, prop) {
    return array.sort(({ [prop]: propA = 0 }, { [prop]: propB = 0 }) => propA > propB ? 1 : propB > propA ? -1 : 0);
}
