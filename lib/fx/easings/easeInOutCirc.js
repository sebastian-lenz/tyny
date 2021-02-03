function easeInOutCirc(time, base, change, duration) {
    if ((time /= duration / 2) < 1) {
        return (-change / 2) * (Math.sqrt(1 - time * time) - 1) + base;
    }
    return (change / 2) * (Math.sqrt(1 - (time -= 2) * time) + 1) + base;
}
(function (easeInOutCirc) {
    function toCSS() {
        return 'cubic-bezier(0.785, 0.135, 0.15, 0.86)';
    }
    easeInOutCirc.toCSS = toCSS;
})(easeInOutCirc || (easeInOutCirc = {}));
export { easeInOutCirc };
