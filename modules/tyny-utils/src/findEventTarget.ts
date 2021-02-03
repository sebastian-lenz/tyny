export default function findEventTarget<T extends HTMLElement = HTMLElement>(
  event: Event | null | undefined,
  classNameOrCallback: Function | string
): T | null {
  if (!event) {
    return null;
  }

  let target = <T>event.target;
  const callback =
    typeof classNameOrCallback === 'function'
      ? classNameOrCallback
      : (el: HTMLElement) => el.classList.contains(classNameOrCallback);

  while (target && target.classList) {
    if (callback(target)) return target;
    target = <T>target.parentNode;
  }

  return null;
}
