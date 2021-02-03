import { isString } from '../../lang/string/isString';
export function createEvent(name, bubbles, cancelable, detail) {
    if (bubbles === void 0) { bubbles = true; }
    if (cancelable === void 0) { cancelable = false; }
    if (!isString(name)) {
        return name;
    }
    var event = document.createEvent('CustomEvent'); // IE 11
    event.initCustomEvent(name, bubbles, cancelable, detail);
    return event;
}
