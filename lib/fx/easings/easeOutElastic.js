export function createEaseOutElastic(amplitude, period) {
    const result = (function easeOutElastic(time, base, change, duration) {
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
        return (amplitude *
            Math.pow(2, -10 * time) *
            Math.sin(((time * duration - scale) * (2 * Math.PI)) / period) +
            change +
            base);
    });
    result.toCSS = () => 'ease-out';
    return result;
}
const easeOutElastic = createEaseOutElastic();
export { easeOutElastic };
