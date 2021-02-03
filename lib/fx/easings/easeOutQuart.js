function easeOutQuart(time, base, change, duartion) {
    return (-change * ((time = time / duartion - 1) * time * time * time - 1) + base);
}
(function (easeOutQuart) {
    function toCSS() {
        return 'cubic-bezier(0.165, 0.84, 0.44, 1)';
    }
    easeOutQuart.toCSS = toCSS;
})(easeOutQuart || (easeOutQuart = {}));
export { easeOutQuart };
