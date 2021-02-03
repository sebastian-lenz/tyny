import { __assign } from "tslib";
import { keyframes } from '../../keyframes';
var id = 0;
export function transform(_a) {
    var _b = _a.extraFrom, extraFrom = _b === void 0 ? {} : _b, _c = _a.extraTo, extraTo = _c === void 0 ? {} : _c, fromTransform = _a.fromTransform, toTransform = _a.toTransform;
    var name = "tynyTransformKeyframes-" + id++;
    return keyframes(name, {
        from: __assign(__assign({}, extraFrom), { transform: fromTransform }),
        to: __assign(__assign({}, extraTo), { transform: toTransform }),
    });
}
