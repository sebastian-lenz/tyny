import { __decorate } from "tslib";
import { CollectionView } from '../CollectionView';
import { isNumber } from '../../utils/lang/number/isNumber';
import { isUndefined } from '../../utils/lang/misc';
import { property } from '../../core';
export const transistEvent = 'tyny:transist';
export class CycleableView extends CollectionView {
    constructor(options = {}) {
        super(options);
        this._current = null;
    }
    get current() {
        return this._current;
    }
    set current(value) {
        this.transist(value);
    }
    get currentIndex() {
        const { _current: current } = this;
        return current ? this.indexOf(current) : -1;
    }
    set currentIndex(value) {
        this.transist(value);
    }
    get next() {
        return this.at(this.normalizeIndex(this.currentIndex + 1));
    }
    get previous() {
        return this.at(this.normalizeIndex(this.currentIndex - 1));
    }
    immediate(value) {
        this.transist(value);
    }
    normalizeIndex(index) {
        const { isLooped, length } = this;
        if (length < 1) {
            return -1;
        }
        let normalized = index;
        if (isLooped) {
            while (normalized < 0)
                normalized += length;
            while (normalized >= length)
                normalized -= length;
        }
        else {
            if (normalized < 0)
                return -1;
            if (normalized >= length)
                return -1;
        }
        return normalized;
    }
    transist(value, options) {
        const from = this._current;
        const to = isNumber(value) ? this.at(this.normalizeIndex(value)) : value;
        if (from === to)
            return;
        this._current = to;
        this.onTransition(from, to, options);
        this.trigger(transistEvent, {
            from,
            options,
            target: this,
            to,
        });
    }
    onConnected() {
        const initialIndex = this.params.int({ name: 'initialIndex' });
        if (!isUndefined(initialIndex)) {
            this.transist(initialIndex);
        }
    }
    onTransition(from, to, options) { }
}
__decorate([
    property({ param: { defaultValue: false, type: 'bool' } })
], CycleableView.prototype, "isLooped", void 0);
