export interface ApplyCallback {
  (element: HTMLElement): void;
}

export interface LateApplyCallback {
  (element: HTMLElement): void;
}

export function apply(
  element: HTMLElement | null | undefined,
  preCallback: ApplyCallback,
  postCallback?: ApplyCallback
) {
  if (!element) {
    return;
  }

  preCallback(element);

  let child = element.firstElementChild as HTMLElement | null;
  while (child) {
    const next = child.nextElementSibling as HTMLElement | null;
    apply(child, preCallback);
    child = next;
  }

  if (postCallback) {
    postCallback(element);
  }
}
