function easeInSine(time, base, change, duration) {
    return -change * Math.cos((time / duration) * (Math.PI / 2)) + change + base;
}
(function (easeInSine) {
    function toCSS() {
        return 'cubic-bezier(0.47, 0, 0.745, 0.715)';
    }
    easeInSine.toCSS = toCSS;
})(easeInSine || (easeInSine = {}));
export { easeInSine };
