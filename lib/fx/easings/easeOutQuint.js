function easeOutQuint(time, base, change, duration) {
    return (change * ((time = time / duration - 1) * time * time * time * time + 1) +
        base);
}
(function (easeOutQuint) {
    function toCSS() {
        return 'cubic-bezier(0.23, 1, 0.32, 1)';
    }
    easeOutQuint.toCSS = toCSS;
})(easeOutQuint || (easeOutQuint = {}));
export { easeOutQuint };
