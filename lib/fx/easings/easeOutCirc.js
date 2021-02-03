function easeOutCirc(time, base, change, duration) {
    return change * Math.sqrt(1 - (time = time / duration - 1) * time) + base;
}
(function (easeOutCirc) {
    function toCSS() {
        return 'cubic-bezier(0.075, 0.82, 0.165, 1)';
    }
    easeOutCirc.toCSS = toCSS;
})(easeOutCirc || (easeOutCirc = {}));
export { easeOutCirc };
