import { __assign } from "tslib";
export function update(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.events, events = _c === void 0 ? 'update' : _c, _d = _b.mode, mode = _d === void 0 ? 'write' : _d;
    return function (target, name) {
        var updates = target.hasOwnProperty('_updates')
            ? target._updates
            : (target._updates = __assign({}, target._updates));
        updates[name] = {
            events: typeof events === 'string' ? [events] : events,
            handler: name,
            mode: mode,
        };
    };
}
