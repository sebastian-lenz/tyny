import { transition } from '../utils/env/transitionProps';

export function withoutTransition(element: HTMLElement, callback: Function) {
  const style = element.style as any;
  style[transition] = 'none';

  callback();

  element.getBoundingClientRect();
  style[transition] = '';
}
