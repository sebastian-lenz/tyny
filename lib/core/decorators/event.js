import { __assign } from "tslib";
export function event(options) {
    return function (target, name) {
        var events = target.hasOwnProperty('_events')
            ? target._events
            : (target._events = __assign({}, target._events));
        events[name] = __assign(__assign({}, options), { handler: name });
    };
}
