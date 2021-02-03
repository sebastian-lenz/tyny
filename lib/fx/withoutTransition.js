import { transition } from '../utils/env/transitionProps';
export function withoutTransition(element, callback) {
    var style = element.style;
    style[transition] = 'none';
    callback();
    element.getBoundingClientRect();
    style[transition] = '';
}
