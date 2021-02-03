import { $ } from './$';
export function empty(value) {
    var element = $(value);
    if (!element) {
        return null;
    }
    element.innerHTML = '';
    return element;
}
