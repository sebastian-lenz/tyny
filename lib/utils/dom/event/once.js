import { __rest } from "tslib";
import { on } from './on';
export function once(target, type, listener, _a = {}) {
    var { condition } = _a, options = __rest(_a, ["condition"]);
    const off = on(target, type, (event) => {
        if (!condition || condition(event)) {
            off();
            listener(event);
        }
    }, options);
    return off;
}
