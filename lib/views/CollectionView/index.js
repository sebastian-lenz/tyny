import { __decorate } from "tslib";
import { View, property } from '../../core';
export const collectionChangedEvent = 'tyny:collectionChanged';
export class CollectionView extends View {
    get items() {
        return this.findAll(this.itemSelector);
    }
    get length() {
        return this.items.length;
    }
    constructor(options = {}) {
        super(options);
    }
    at(index) {
        return this.items[index] || null;
    }
    contains(item) {
        return this.indexOf(item) !== -1;
    }
    indexOf(item) {
        return this.items.indexOf(item);
    }
    onItemsChanged(items) {
        this.trigger(collectionChangedEvent, {
            items,
            target: this,
        });
    }
}
__decorate([
    property({ param: { defaultValue: '> *', type: 'string' } })
], CollectionView.prototype, "itemSelector", void 0);
__decorate([
    property({ watch: 'onItemsChanged' })
], CollectionView.prototype, "items", null);
