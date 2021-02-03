function easeInOutCubic(time, base, change, duration) {
    if ((time /= duration / 2) < 1) {
        return (change / 2) * time * time * time + base;
    }
    return (change / 2) * ((time -= 2) * time * time + 2) + base;
}
(function (easeInOutCubic) {
    function toCSS() {
        return 'cubic-bezier(0.645, 0.045, 0.355, 1)';
    }
    easeInOutCubic.toCSS = toCSS;
})(easeInOutCubic || (easeInOutCubic = {}));
export { easeInOutCubic };
