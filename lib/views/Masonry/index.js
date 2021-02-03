import { __decorate } from "tslib";
import { CollectionView } from '../CollectionView';
import { update } from '../../core';
export class Masonry extends CollectionView {
    constructor(options = {}) {
        super(options);
        //
        this._strategy = null;
        this.strategy = options.strategy || null;
    }
    get container() {
        return this.el;
    }
    get strategy() {
        return this._strategy;
    }
    set strategy(value) {
        const { _strategy } = this;
        if (_strategy === value)
            return;
        if (_strategy) {
            _strategy.setMasonry(null);
        }
        if (value) {
            value.setMasonry(this);
        }
        this._strategy = value;
        this.callUpdate();
    }
    onMeasure() {
        const { _strategy } = this;
        if (!_strategy) {
            return;
        }
        const updates = _strategy.apply();
        if (updates.length) {
            return () => {
                updates.forEach((update) => update());
            };
        }
    }
}
__decorate([
    update({ events: ['resize', 'update'], mode: 'read' })
], Masonry.prototype, "onMeasure", null);
