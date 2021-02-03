export function createEaseInOutBack(scale) {
    if (scale === void 0) { scale = 1.70158; }
    var result = (function easeInOutBack(time, base, change, duration) {
        if ((time /= duration / 2) < 1) {
            return ((change / 2) *
                (time * time * (((scale *= 1.525) + 1) * time - scale)) +
                base);
        }
        return ((change / 2) *
            ((time -= 2) * time * (((scale *= 1.525) + 1) * time + scale) + 2) +
            base);
    });
    result.toCSS = function () { return 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; };
    return result;
}
var easeInOutBack = createEaseInOutBack();
export { easeInOutBack };
