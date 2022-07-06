export function delay(timeout: number) {
  return new Promise((resolve) => window.setTimeout(resolve, timeout));
}
