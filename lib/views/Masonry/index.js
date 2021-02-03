import { __decorate, __extends } from "tslib";
import { CollectionView } from '../CollectionView';
import { update } from '../../core';
var Masonry = /** @class */ (function (_super) {
    __extends(Masonry, _super);
    function Masonry(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        //
        _this._strategy = null;
        _this.strategy = options.strategy || null;
        return _this;
    }
    Object.defineProperty(Masonry.prototype, "container", {
        get: function () {
            return this.el;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Masonry.prototype, "strategy", {
        get: function () {
            return this._strategy;
        },
        set: function (value) {
            var _strategy = this._strategy;
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
        },
        enumerable: false,
        configurable: true
    });
    Masonry.prototype.onMeasure = function () {
        var _strategy = this._strategy;
        if (!_strategy) {
            return;
        }
        var updates = _strategy.apply();
        if (updates.length) {
            return function () {
                updates.forEach(function (update) { return update(); });
            };
        }
    };
    __decorate([
        update({ events: ['resize', 'update'], mode: 'read' })
    ], Masonry.prototype, "onMeasure", null);
    return Masonry;
}(CollectionView));
export { Masonry };
