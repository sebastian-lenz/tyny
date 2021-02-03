import { __decorate, __extends } from "tslib";
import { CollectionView } from '../CollectionView';
import { isNumber } from '../../utils/lang/number/isNumber';
import { isUndefined } from '../../utils/lang/misc';
import { property } from '../../core';
export var transistEvent = 'tyny:transist';
var CycleableView = /** @class */ (function (_super) {
    __extends(CycleableView, _super);
    function CycleableView(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        //
        _this._current = null;
        return _this;
    }
    Object.defineProperty(CycleableView.prototype, "current", {
        get: function () {
            return this._current;
        },
        set: function (value) {
            this.transist(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CycleableView.prototype, "currentIndex", {
        get: function () {
            var current = this._current;
            return current ? this.indexOf(current) : -1;
        },
        set: function (value) {
            this.transist(value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CycleableView.prototype, "next", {
        get: function () {
            return this.at(this.normalizeIndex(this.currentIndex + 1));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CycleableView.prototype, "previous", {
        get: function () {
            return this.at(this.normalizeIndex(this.currentIndex - 1));
        },
        enumerable: false,
        configurable: true
    });
    CycleableView.prototype.immediate = function (value) {
        this.transist(value);
    };
    CycleableView.prototype.normalizeIndex = function (index) {
        var _a = this, isLooped = _a.isLooped, length = _a.length;
        if (length < 1) {
            return -1;
        }
        var normalized = index;
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
    };
    CycleableView.prototype.transist = function (value, options) {
        var from = this._current;
        var to = isNumber(value) ? this.at(this.normalizeIndex(value)) : value;
        if (from === to)
            return;
        this._current = to;
        this.onTransition(from, to, options);
        this.trigger(transistEvent, {
            from: from,
            options: options,
            target: this,
            to: to,
        });
    };
    CycleableView.prototype.onConnected = function () {
        var initialIndex = this.params.int({ name: 'initialIndex' });
        if (!isUndefined(initialIndex)) {
            this.transist(initialIndex);
        }
    };
    CycleableView.prototype.onTransition = function (from, to, options) { };
    __decorate([
        property({ param: { defaultValue: false, type: 'bool' } })
    ], CycleableView.prototype, "isLooped", void 0);
    return CycleableView;
}(CollectionView));
export { CycleableView };
