export function createEaseInElastic(amplitude, period) {
    var result = (function easeInElastic(time, base, change, duration) {
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
        return (-(amplitude *
            Math.pow(2, 10 * (time -= 1)) *
            Math.sin(((time * duration - scale) * (2 * Math.PI)) / period)) + base);
    });
    result.toCSS = function () { return 'ease-in'; };
    return result;
}
var easeInElastic = createEaseInElastic();
export { easeInElastic };
