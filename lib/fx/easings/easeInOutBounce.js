import { easeInBounce } from './easeInBounce';
import { easeOutBounce } from './easeOutBounce';
function easeInOutBounce(time, base, change, duration) {
    if (time < duration / 2)
        return easeInBounce(time * 2, 0, change, duration) * 0.5 + base;
    return (easeOutBounce(time * 2 - duration, 0, change, duration) * 0.5 +
        change * 0.5 +
        base);
}
(function (easeInOutBounce) {
    function toCSS() {
        return 'ease-in-out';
    }
    easeInOutBounce.toCSS = toCSS;
})(easeInOutBounce || (easeInOutBounce = {}));
export { easeInOutBounce };
