import { __rest } from "tslib";
import { closest } from '../node/closest';
import { findAll } from '../node/find';
import { isBoolean } from '../../lang/misc/isBoolean';
import { isElement } from '../misc/isElement';
import { isIE } from '../../env';
import { toEventTargets } from './toEventTargets';
import { within } from '../node/within';
function delegate(delegates, selector, listener) {
    return function (event) {
        delegates.forEach((delegate) => {
            const current = selector[0] === '>' && isElement(delegate)
                ? findAll(selector, delegate)
                    .reverse()
                    .filter((element) => within(event.target, element))[0]
                : closest(event.target, selector);
            if (current) {
                event.delegate = delegate;
                event.current = current;
                listener.call(this, event);
            }
        });
    };
}
function detail(listener) {
    return function (event) {
        event instanceof CustomEvent && Array.isArray(event.detail)
            ? listener(event, ...event.detail)
            : listener(event);
    };
}
function selfFilter(listener) {
    return function (event) {
        if (event.target === event.currentTarget) {
            return listener(event);
        }
    };
}
function useCaptureFilter(options) {
    return options && isIE && !isBoolean(options) ? !!options.capture : options;
}
export function on(target, type, listener, _a = {}) {
    var { selector, self, scope } = _a, options = __rest(_a, ["selector", "self", "scope"]);
    const targets = toEventTargets(target);
    if (scope) {
        listener = listener.bind(scope);
    }
    if (listener.length > 1) {
        listener = detail(listener);
    }
    if (self) {
        listener = selfFilter(listener);
    }
    if (selector) {
        listener = delegate(targets, selector, listener);
    }
    const listenerOptions = useCaptureFilter(options);
    type
        .split(' ')
        .forEach((type) => targets.forEach((target) => target.addEventListener(type, listener, listenerOptions)));
    return function () {
        off(targets, type, listener, listenerOptions);
    };
}
export function off(target, type, listener, options = false) {
    const targets = toEventTargets(target);
    options = useCaptureFilter(options);
    type
        .split(' ')
        .forEach((type) => targets.forEach((target) => target.removeEventListener(type, listener, options)));
}
