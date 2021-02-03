export function update({ events = 'update', mode = 'write', } = {}) {
    return function (target, name) {
        const updates = target.hasOwnProperty('_updates')
            ? target._updates
            : (target._updates = Object.assign({}, target._updates));
        updates[name] = {
            events: typeof events === 'string' ? [events] : events,
            handler: name,
            mode,
        };
    };
}
