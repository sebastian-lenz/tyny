export function clientRectIntersects(lhs, rhs) {
    return (lhs.left < rhs.right &&
        lhs.right > rhs.left &&
        lhs.top < rhs.bottom &&
        lhs.bottom > rhs.top);
}
