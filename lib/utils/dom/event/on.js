import { __rest, __spreadArrays } from "tslib";
import { closest } from '../node/closest';
import { findAll } from '../node/find';
import { isBoolean } from '../../lang/misc/isBoolean';
import { isElement } from '../misc/isElement';
import { isIE } from '../../env';
import { toEventTargets } from './toEventTargets';
import { within } from '../node/within';
function delegate(delegates, selector, listener) {
    return function (event) {
        var _this = this;
        delegates.forEach(function (delegate) {
            var current = selector[0] === '>' && isElement(delegate)
                ? findAll(selector, delegate)
                    .reverse()
                    .filter(function (element) { return within(event.target, element); })[0]
                : closest(event.target, selector);
            if (current) {
                event.delegate = delegate;
                event.current = current;
                listener.call(_this, event);
            }
        });
    };
}
function detail(listener) {
    return function (event) {
        event instanceof CustomEvent && Array.isArray(event.detail)
            ? listener.apply(void 0, __spreadArrays([event], event.detail)) : listener(event);
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
export function on(target, type, listener, _a) {
    if (_a === void 0) { _a = {}; }
    var selector = _a.selector, self = _a.self, scope = _a.scope, options = __rest(_a, ["selector", "self", "scope"]);
    var targets = toEventTargets(target);
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
    var listenerOptions = useCaptureFilter(options);
    type
        .split(' ')
        .forEach(function (type) {
        return targets.forEach(function (target) {
            return target.addEventListener(type, listener, listenerOptions);
        });
    });
    return function () {
        off(targets, type, listener, listenerOptions);
    };
}
export function off(target, type, listener, options) {
    if (options === void 0) { options = false; }
    var targets = toEventTargets(target);
    options = useCaptureFilter(options);
    type
        .split(' ')
        .forEach(function (type) {
        return targets.forEach(function (target) {
            return target.removeEventListener(type, listener, options);
        });
    });
}
