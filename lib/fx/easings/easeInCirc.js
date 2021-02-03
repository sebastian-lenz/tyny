function easeInCirc(time, base, change, duration) {
    return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + base;
}
(function (easeInCirc) {
    function toCSS() {
        return 'cubic-bezier(0.6, 0.04, 0.98, 0.335)';
    }
    easeInCirc.toCSS = toCSS;
})(easeInCirc || (easeInCirc = {}));
export { easeInCirc };
