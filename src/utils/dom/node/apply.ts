export function apply(
  element: HTMLElement | null | undefined,
  callback: { (element: HTMLElement): void }
) {
  if (!element) return;
  callback(element);

  element = element.firstElementChild as HTMLElement | null;
  while (element) {
    const next = element.nextElementSibling as HTMLElement | null;
    apply(element, callback);
    element = next;
  }
}
