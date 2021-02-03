export function clamp(value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}
