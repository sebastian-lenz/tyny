import { __assign, __rest } from "tslib";
import { animate } from '../animate';
import { transform } from './keyframes/transform';
export function roll(_a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.fade, fade = _b === void 0 ? false : _b, _c = _a.x, x = _c === void 0 ? 0 : _c, _d = _a.y, y = _d === void 0 ? 0 : _d, options = __rest(_a, ["fade", "x", "y"]);
    var merged = __assign(__assign({}, animate.defaultOptions), options);
    var fromAnimation = transform({
        fromTransform: "translate(0, 0)",
        toTransform: "translate(" + -x + "%, " + -y + "%)",
        extraFrom: fade ? { opacity: 1 } : {},
        extraTo: fade ? { opacity: 0 } : {},
    });
    var toAnimation = transform({
        fromTransform: "translate(" + x + "%, " + y + "%)",
        toTransform: "translate(0, 0)",
        extraFrom: fade ? { opacity: 0 } : {},
        extraTo: fade ? { opacity: 1 } : {},
    });
    return function (from, to) {
        var animations = [];
        if (to) {
            animations.push(animate(to, toAnimation, merged));
        }
        if (from) {
            animations.push(animate(from, fromAnimation, merged));
        }
        return animations.length
            ? Promise.all(animations).then(function () { return undefined; })
            : Promise.resolve();
    };
}
