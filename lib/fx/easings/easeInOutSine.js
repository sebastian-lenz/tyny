function easeInOutSine(time, base, change, duration) {
    return (-change / 2) * (Math.cos((Math.PI * time) / duration) - 1) + base;
}
(function (easeInOutSine) {
    function toCSS() {
        return 'cubic-bezier(0.445, 0.05, 0.55, 0.95)';
    }
    easeInOutSine.toCSS = toCSS;
})(easeInOutSine || (easeInOutSine = {}));
export { easeInOutSine };
