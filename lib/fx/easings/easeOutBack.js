export function createEaseOutBack(scale) {
    if (scale === void 0) { scale = 1.70158; }
    var result = (function easeOutBack(time, base, change, duration) {
        return (change *
            ((time = time / duration - 1) * time * ((scale + 1) * time + scale) +
                1) +
            base);
    });
    result.toCSS = function () { return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'; };
    return result;
}
var easeOutBack = createEaseOutBack();
export { easeOutBack };
