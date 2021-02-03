function linear(time, base, change, duration) {
    return base + change * (time / duration);
}
(function (linear) {
    function toCSS() {
        return 'linear';
    }
    linear.toCSS = toCSS;
})(linear || (linear = {}));
export { linear };
