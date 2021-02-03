import { __decorate, __extends } from "tslib";
import { View, property } from '../../core';
export var collectionChangedEvent = 'tyny:collectionChanged';
var CollectionView = /** @class */ (function (_super) {
    __extends(CollectionView, _super);
    function CollectionView(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    Object.defineProperty(CollectionView.prototype, "items", {
        get: function () {
            return this.findAll(this.itemSelector);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CollectionView.prototype, "length", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    CollectionView.prototype.at = function (index) {
        return this.items[index] || null;
    };
    CollectionView.prototype.contains = function (item) {
        return this.indexOf(item) !== -1;
    };
    CollectionView.prototype.indexOf = function (item) {
        return this.items.indexOf(item);
    };
    CollectionView.prototype.onItemsChanged = function (items) {
        this.trigger(collectionChangedEvent, {
            items: items,
            target: this,
        });
    };
    __decorate([
        property({ param: { defaultValue: '> *', type: 'string' } })
    ], CollectionView.prototype, "itemSelector", void 0);
    __decorate([
        property({ watch: 'onItemsChanged' })
    ], CollectionView.prototype, "items", null);
    return CollectionView;
}(View));
export { CollectionView };
