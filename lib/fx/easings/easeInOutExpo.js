function easeInOutExpo(time, base, change, duration) {
    if (time == 0)
        return base;
    if (time == duration)
        return base + change;
    if ((time /= duration / 2) < 1) {
        return (change / 2) * Math.pow(2, 10 * (time - 1)) + base;
    }
    return (change / 2) * (-Math.pow(2, -10 * --time) + 2) + base;
}
(function (easeInOutExpo) {
    function toCSS() {
        return 'cubic-bezier(1, 0, 0, 1)';
    }
    easeInOutExpo.toCSS = toCSS;
})(easeInOutExpo || (easeInOutExpo = {}));
export { easeInOutExpo };
