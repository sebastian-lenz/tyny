export function getContentHeight() {
  return Math.max(
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
