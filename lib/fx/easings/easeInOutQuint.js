function easeInOutQuint(time, base, change, duration) {
    if ((time /= duration / 2) < 1) {
        return (change / 2) * time * time * time * time * time + base;
    }
    return (change / 2) * ((time -= 2) * time * time * time * time + 2) + base;
}
(function (easeInOutQuint) {
    function toCSS() {
        return 'cubic-bezier(0.86, 0, 0.07, 1)';
    }
    easeInOutQuint.toCSS = toCSS;
})(easeInOutQuint || (easeInOutQuint = {}));
export { easeInOutQuint };
