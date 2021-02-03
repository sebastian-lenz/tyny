function easeInExpo(time, base, change, duration) {
    return time == 0
        ? base
        : change * Math.pow(2, 10 * (time / duration - 1)) + base;
}
(function (easeInExpo) {
    function toCSS() {
        return 'cubic-bezier(0.95, 0.05, 0.795, 0.035)';
    }
    easeInExpo.toCSS = toCSS;
})(easeInExpo || (easeInExpo = {}));
export { easeInExpo };
