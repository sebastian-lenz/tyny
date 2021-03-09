export function getContentWidth() {
  return Math.max(
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}
