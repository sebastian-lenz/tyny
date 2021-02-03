function easeOutQuad(time, base, change, duration) {
    return -change * (time /= duration) * (time - 2) + base;
}
(function (easeOutQuad) {
    function toCSS() {
        return 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    easeOutQuad.toCSS = toCSS;
})(easeOutQuad || (easeOutQuad = {}));
export { easeOutQuad };
