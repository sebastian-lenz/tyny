export function getScrollTop(): number {
  return (
    window.pageYOffset ||
    (document.documentElement && document.documentElement.scrollTop) ||
    document.body.scrollTop
  );
}
