function easeInQuart(time, base, change, duration) {
    return change * (time /= duration) * time * time * time + base;
}
(function (easeInQuart) {
    function toCSS() {
        return 'cubic-bezier(0.895, 0.03, 0.685, 0.22)';
    }
    easeInQuart.toCSS = toCSS;
})(easeInQuart || (easeInQuart = {}));
export { easeInQuart };
