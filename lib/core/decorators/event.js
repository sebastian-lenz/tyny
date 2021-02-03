export function event(options) {
    return function (target, name) {
        const events = target.hasOwnProperty('_events')
            ? target._events
            : (target._events = Object.assign({}, target._events));
        events[name] = Object.assign(Object.assign({}, options), { handler: name });
    };
}
