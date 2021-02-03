export function pointInRect(point, rect) {
    return (point.x <= rect.right &&
        point.x >= rect.left &&
        point.y <= rect.bottom &&
        point.y >= rect.top);
}
