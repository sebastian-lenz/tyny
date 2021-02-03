function easeInQuint(time, base, change, duration) {
    return change * (time /= duration) * time * time * time * time + base;
}
(function (easeInQuint) {
    function toCSS() {
        return 'cubic-bezier(0.755, 0.05, 0.855, 0.06)';
    }
    easeInQuint.toCSS = toCSS;
})(easeInQuint || (easeInQuint = {}));
export { easeInQuint };
