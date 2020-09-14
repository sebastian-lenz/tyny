export function getScrollLeft(): number {
  return (
    window.pageXOffset ||
    (document.documentElement && document.documentElement.scrollLeft) ||
    document.body.scrollLeft
  );
}
