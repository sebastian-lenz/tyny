import { isString } from '../../lang/string/isString';
export function createEvent(name, bubbles = true, cancelable = false, detail) {
    if (!isString(name)) {
        return name;
    }
    const event = document.createEvent('CustomEvent'); // IE 11
    event.initCustomEvent(name, bubbles, cancelable, detail);
    return event;
}
