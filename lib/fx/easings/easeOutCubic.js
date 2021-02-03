function easeOutCubic(time, base, change, duration) {
    return change * ((time = time / duration - 1) * time * time + 1) + base;
}
(function (easeOutCubic) {
    function toCSS() {
        return 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    }
    easeOutCubic.toCSS = toCSS;
})(easeOutCubic || (easeOutCubic = {}));
export { easeOutCubic };
