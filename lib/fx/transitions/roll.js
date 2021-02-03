import { __rest } from "tslib";
import { animate } from '../animate';
import { transform } from './keyframes/transform';
export function roll(_a = {}) {
    var { fade = false, x = 0, y = 0 } = _a, options = __rest(_a, ["fade", "x", "y"]);
    const merged = Object.assign(Object.assign({}, animate.defaultOptions), options);
    const fromAnimation = transform({
        fromTransform: `translate(0, 0)`,
        toTransform: `translate(${-x}%, ${-y}%)`,
        extraFrom: fade ? { opacity: 1 } : {},
        extraTo: fade ? { opacity: 0 } : {},
    });
    const toAnimation = transform({
        fromTransform: `translate(${x}%, ${y}%)`,
        toTransform: `translate(0, 0)`,
        extraFrom: fade ? { opacity: 0 } : {},
        extraTo: fade ? { opacity: 1 } : {},
    });
    return (from, to) => {
        const animations = [];
        if (to) {
            animations.push(animate(to, toAnimation, merged));
        }
        if (from) {
            animations.push(animate(from, fromAnimation, merged));
        }
        return animations.length
            ? Promise.all(animations).then(() => undefined)
            : Promise.resolve();
    };
}
