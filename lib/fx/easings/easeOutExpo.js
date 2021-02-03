function easeOutExpo(time, base, change, duration) {
    return time == duration
        ? base + change
        : change * (-Math.pow(2, (-10 * time) / duration) + 1) + base;
}
(function (easeOutExpo) {
    function toCSS() {
        return 'cubic-bezier(0.19, 1, 0.22, 1)';
    }
    easeOutExpo.toCSS = toCSS;
})(easeOutExpo || (easeOutExpo = {}));
export { easeOutExpo };
