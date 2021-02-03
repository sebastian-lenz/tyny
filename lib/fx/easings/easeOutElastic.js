export function createEaseOutElastic(amplitude, period) {
    var result = (function easeOutElastic(time, base, change, duration) {
        var scale;
        if (time == 0)
            return base;
        if ((time /= duration) == 1)
            return base + change;
        if (!period)
            period = duration * 0.3;
        if (!amplitude || amplitude < Math.abs(change)) {
            amplitude = change;
            scale = period / 4;
        }
        else {
            scale = (period / (2 * Math.PI)) * Math.asin(change / amplitude);
        }
        return (amplitude *
            Math.pow(2, -10 * time) *
            Math.sin(((time * duration - scale) * (2 * Math.PI)) / period) +
            change +
            base);
    });
    result.toCSS = function () { return 'ease-out'; };
    return result;
}
var easeOutElastic = createEaseOutElastic();
export { easeOutElastic };
