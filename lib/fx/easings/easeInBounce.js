import { easeOutBounce } from './easeOutBounce';
function easeInBounce(time, base, change, duration) {
    return change - easeOutBounce(duration - time, 0, change, duration) + base;
}
(function (easeInBounce) {
    function toCSS() {
        return 'ease-in';
    }
    easeInBounce.toCSS = toCSS;
})(easeInBounce || (easeInBounce = {}));
export { easeInBounce };
