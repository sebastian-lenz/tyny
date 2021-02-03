import { $ } from './$';
export function empty(value) {
    const element = $(value);
    if (!element) {
        return null;
    }
    element.innerHTML = '';
    return element;
}
