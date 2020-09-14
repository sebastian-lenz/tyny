export function clientRectIntersects(
  lhs: tyny.BareClientRect,
  rhs: tyny.BareClientRect
): boolean {
  return (
    lhs.left < rhs.right &&
    lhs.right > rhs.left &&
    lhs.top < rhs.bottom &&
    lhs.bottom > rhs.top
  );
}
