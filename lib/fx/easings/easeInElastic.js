export function createEaseInElastic(amplitude, period) {
    const result = (function easeInElastic(time, base, change, duration) {
        let scale;
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
    result.toCSS = () => 'ease-in';
    return result;
}
const easeInElastic = createEaseInElastic();
export { easeInElastic };
