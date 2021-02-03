function easeInOutQuad(time, base, change, duration) {
    if ((time /= duration / 2) < 1) {
        return (change / 2) * time * time + base;
    }
    return (-change / 2) * (--time * (time - 2) - 1) + base;
}
(function (easeInOutQuad) {
    function toCSS() {
        return 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';
    }
    easeInOutQuad.toCSS = toCSS;
})(easeInOutQuad || (easeInOutQuad = {}));
export { easeInOutQuad };
