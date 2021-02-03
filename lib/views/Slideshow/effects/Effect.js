export class Effect {
    constructor() {
        this.from = null;
        this.to = null;
        this.value = Number.NaN;
    }
    apply(from, to, value) {
        const { from: lastFrom, to: lastTo, value: lastValue } = this;
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
    }
    clear() {
        const { from, to } = this;
        this.from = null;
        this.to = null;
        if (from) {
            this.unbindElement(from);
        }
        if (to) {
            this.unbindElement(to);
        }
    }
    applyFrom(element, value) { }
    applyTo(element, value) { }
    bindElement(element) {
        element.classList.add('effect');
    }
    unbindElement(element) {
        element.classList.remove('effect');
        this.clearElement(element);
    }
    clearElement(element) { }
}
