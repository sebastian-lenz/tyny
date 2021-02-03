import { __decorate } from "tslib";
import { collectionChangedEvent } from '../CollectionView';
import { CycleableView, transistEvent } from '../CycleableView';
import { property } from '../../core';
import { isString } from '../../utils/lang/string';
import { on } from '../../utils/dom/event';
import { AbstractNumeration, } from './AbstractNumeration';
export const numerationChangeEvent = 'tyny:numerationChange';
export class Numeration extends AbstractNumeration {
    constructor(options = {}) {
        super(options);
        this._targetListeners = null;
        const { ignoreUndecided = true } = options;
        this.ignoreUndecided = ignoreUndecided;
    }
    get target() {
        const target = this.params.read({ name: 'target' });
        if (target instanceof CycleableView) {
            return target;
        }
        else if (isString(target)) {
            return this.findView(target, CycleableView);
        }
        else {
            return null;
        }
    }
    onCurrentChanged() {
        const { ignoreUndecided, target } = this;
        if (!target) {
            return;
        }
        const { currentIndex } = target;
        if (ignoreUndecided && currentIndex === -1) {
            return;
        }
        this.setSelectedIndex(currentIndex);
    }
    onLengthChanged() {
        const { target } = this;
        if (target) {
            this.setLength(target.length);
        }
    }
    onTargetChanged(target) {
        const { _targetListeners } = this;
        if (_targetListeners) {
            _targetListeners.forEach((off) => off());
        }
        if (target) {
            const { el } = target;
            this._targetListeners = [
                on(el, collectionChangedEvent, this.onLengthChanged, { scope: this }),
                on(el, transistEvent, this.onCurrentChanged, { scope: this }),
            ];
            this.setLength(target.length);
            this.setSelectedIndex(target.currentIndex);
        }
    }
    selectIndex(index) {
        const { target } = this;
        if (target) {
            target.currentIndex = index;
        }
        else {
            this.trigger(numerationChangeEvent, {
                index,
                target: this,
            });
        }
    }
}
__decorate([
    property({ immediate: true, watch: 'onTargetChanged' })
], Numeration.prototype, "target", null);
