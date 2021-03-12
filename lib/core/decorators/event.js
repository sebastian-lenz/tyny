export function event(options) {
    return function (target, handler) {
        const events = target.hasOwnProperty('_events')
            ? target._events
            : (target._events = Object.assign({}, target._events));
        events[handler] = Object.assign(Object.assign({}, options), { handler });
    };
}
