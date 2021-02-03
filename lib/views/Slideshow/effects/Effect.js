var Effect = /** @class */ (function () {
    function Effect() {
        this.from = null;
        this.to = null;
        this.value = Number.NaN;
    }
    Effect.prototype.apply = function (from, to, value) {
        var _a = this, lastFrom = _a.from, lastTo = _a.to, lastValue = _a.value;
        if (lastFrom === from && lastTo === to && lastValue === value) {
            return;
        }
        if (lastFrom !== from) {
            this.from = from;
            if (lastFrom && lastFrom !== to)
                this.unbindElement(lastFrom);
            if (from)
                this.bindElement(from);
        }
        if (lastTo !== to) {
            this.to = to;
            if (lastTo && lastTo !== from)
                this.unbindElement(lastTo);
            if (to)
                this.bindElement(to);
        }
        if (from) {
            this.applyFrom(from, value);
        }
        if (to) {
            this.applyTo(to, value);
        }
    };
    Effect.prototype.clear = function () {
        var _a = this, from = _a.from, to = _a.to;
        this.from = null;
        this.to = null;
        if (from) {
            this.unbindElement(from);
        }
        if (to) {
            this.unbindElement(to);
        }
    };
    Effect.prototype.applyFrom = function (element, value) { };
    Effect.prototype.applyTo = function (element, value) { };
    Effect.prototype.bindElement = function (element) {
        element.classList.add('effect');
    };
    Effect.prototype.unbindElement = function (element) {
        element.classList.remove('effect');
        this.clearElement(element);
    };
    Effect.prototype.clearElement = function (element) { };
    return Effect;
}());
export { Effect };
