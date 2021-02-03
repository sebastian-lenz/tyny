import { bezier } from '../utils/bezier';
export function cubicBezier(x1, y1, x2, y2) {
    var easing = bezier(x1, y1, x2, y1);
    var result = (function cubicBezier(time, base, change, duration) {
        return base + easing(time / duration) * change;
    });
    result.toCSS = function () { return "cubic-bezier(" + x1 + ", " + y1 + ", " + x2 + ", " + y2 + ")"; };
    return result;
}
