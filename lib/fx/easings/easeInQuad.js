function easeInQuad(time, base, change, duration) {
    return change * (time /= duration) * time + base;
}
(function (easeInQuad) {
    function toCSS() {
        return 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    }
    easeInQuad.toCSS = toCSS;
})(easeInQuad || (easeInQuad = {}));
export { easeInQuad };
