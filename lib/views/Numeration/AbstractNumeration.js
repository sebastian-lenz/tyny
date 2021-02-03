import { __assign, __decorate, __extends } from "tslib";
import { event, View } from '../../core';
export var numerationChangeEvent = 'tyny:numerationChange';
var AbstractNumeration = /** @class */ (function (_super) {
    __extends(AbstractNumeration, _super);
    function AbstractNumeration(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, __assign({ tagName: 'ul' }, options)) || this;
        _this.items = [];
        _this.selectedRange = { min: -1, max: -1 };
        var _a = options.itemClass, itemClass = _a === void 0 ? _this.component.className + "--item" : _a, _b = options.itemTagName, itemTagName = _b === void 0 ? 'li' : _b, _c = options.selectedItemClass, selectedItemClass = _c === void 0 ? 'selected' : _c;
        _this.itemClass = itemClass;
        _this.itemTagName = itemTagName;
        _this.selectedItemClass = selectedItemClass;
        _this.container = _this.params.element({
            name: 'container',
            defaultValue: _this.el,
        });
        return _this;
    }
    AbstractNumeration.prototype.setLength = function (length) {
        var _a = this, container = _a.container, itemClass = _a.itemClass, items = _a.items, itemTagName = _a.itemTagName;
        var itemsLength = items.length;
        if (itemsLength == length) {
            return this;
        }
        while (itemsLength < length) {
            var item = document.createElement(itemTagName);
            item.className = itemClass;
            item.innerText = "" + (itemsLength + 1);
            items.push(item);
            itemsLength += 1;
            container.appendChild(item);
        }
        while (itemsLength > length) {
            var child = items.pop();
            if (child) {
                container.removeChild(child);
            }
            itemsLength -= 1;
        }
        this.setSelected(this.selectedRange);
    };
    AbstractNumeration.prototype.setSelected = function (range) {
        var _a = this, items = _a.items, selectedRange = _a.selectedRange, selectedItemClass = _a.selectedItemClass;
        var length = items.length - 1;
        var min = range.min, max = range.max;
        min = Math.max(-1, Math.min(length, Math.floor(min)));
        max = Math.max(-1, Math.min(length, Math.ceil(max)));
        if (max < min) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        if (selectedRange.min == min && selectedRange.max == max) {
            return this;
        }
        for (var index = 0; index <= length; index++) {
            items[index].classList.toggle(selectedItemClass, index >= min && index <= max);
        }
        selectedRange.min = min;
        selectedRange.max = max;
        return this;
    };
    AbstractNumeration.prototype.setSelectedIndex = function (index) {
        this.setSelected({ min: index, max: index });
    };
    AbstractNumeration.prototype.onClick = function (event) {
        var _a = this, el = _a.el, items = _a.items;
        var target = event.target;
        while (target) {
            var index = items.indexOf(target);
            if (index !== -1) {
                return this.selectIndex(index);
            }
            if (target === el)
                return;
            target = target.parentElement;
        }
    };
    __decorate([
        event({ name: 'click' })
    ], AbstractNumeration.prototype, "onClick", null);
    return AbstractNumeration;
}(View));
export { AbstractNumeration };
