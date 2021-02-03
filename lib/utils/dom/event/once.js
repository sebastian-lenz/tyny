import { __rest } from "tslib";
import { on } from './on';
export function once(target, type, listener, _a) {
    if (_a === void 0) { _a = {}; }
    var condition = _a.condition, options = __rest(_a, ["condition"]);
    var off = on(target, type, function (event) {
        if (!condition || condition(event)) {
            off();
            listener(event);
        }
    }, options);
    return off;
}
