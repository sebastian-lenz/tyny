function easeOutSine(time, base, change, duration) {
    return change * Math.sin((time / duration) * (Math.PI / 2)) + base;
}
(function (easeOutSine) {
    function toCSS() {
        return 'cubic-bezier(0.39, 0.575, 0.565, 1)';
    }
    easeOutSine.toCSS = toCSS;
})(easeOutSine || (easeOutSine = {}));
export { easeOutSine };
