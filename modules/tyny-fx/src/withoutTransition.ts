import transitionProps from 'tyny-utils/lib/vendors/transitionProps';

/**
 * Run the given callback while all transitions on the given
 * element are blocked.
 */
export default function withoutTransition(
  element: HTMLElement,
  callback: Function
) {
  const { hasTransition, transition } = transitionProps();
  const style = <any>element.style;

  if (!hasTransition) {
    callback();
  } else {
    style[transition] = 'none';
    callback();
    element.getBoundingClientRect();
    style[transition] = '';
  }
}
