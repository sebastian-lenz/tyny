export function pointInRect(point: tyny.Point, rect: tyny.ClientRect): boolean {
  return (
    point.x <= rect.right &&
    point.x >= rect.left &&
    point.y <= rect.bottom &&
    point.y >= rect.top
  );
}
