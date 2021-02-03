function easeInCubic(time, base, change, duration) {
    return change * (time /= duration) * time * time + base;
}
(function (easeInCubic) {
    function toCSS() {
        return 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
    }
    easeInCubic.toCSS = toCSS;
})(easeInCubic || (easeInCubic = {}));
export { easeInCubic };
