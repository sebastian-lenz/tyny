import { clamp } from '../../utils/lang/number/clamp';
import { Column } from './Column';
import { isEqual } from '../../utils/lang/object';
function applyStyle(el, last, next) {
    return function () {
        if (last)
            for (var key in last)
                el.style[key] = '';
        if (next)
            for (var key in next)
                el.style[key] = next[key];
    };
}
var ColumnPacking = /** @class */ (function () {
    function ColumnPacking(_a) {
        var columnCount = _a.columnCount, _b = _a.gutter, gutter = _b === void 0 ? 0 : _b;
        this.gutter = 0;
        this.columns = [];
        this.columnWidth = 0;
        this.height = 0;
        this.items = [];
        this.masonry = null;
        this.width = 0;
        this.columnCount = columnCount;
        this.gutter = gutter;
    }
    ColumnPacking.prototype.apply = function () {
        var _this = this;
        var _a = this, items = _a.items, masonry = _a.masonry;
        var result = [];
        if (!masonry || !this.reset(masonry)) {
            return result;
        }
        this.items = masonry.items.map(function (el) {
            var last = items.find(function (item) { return item.el === el; });
            var next = _this.place(el);
            if (!last || !isEqual(last.style, next.style)) {
                result.push(applyStyle(el, last === null || last === void 0 ? void 0 : last.style, next.style));
            }
            return next;
        });
        var height = this.getMaxHeight();
        if (height !== this.height) {
            this.height = height;
            result.push(function () {
                masonry.container.style.height = height + "px";
            });
        }
        return result;
    };
    ColumnPacking.prototype.setMasonry = function (value) {
        var masonry = this.masonry;
        if (masonry === value)
            return;
        this.items.forEach(function (item) { return applyStyle(item.el, item.style)(); });
        if (masonry) {
            masonry.el.style.height = '';
        }
        this.columns.length = 0;
        this.height = 0;
        this.items.length = 0;
        this.masonry = value;
        this.width = 0;
    };
    ColumnPacking.prototype.findPosition = function (el) {
        var columns = this.columns;
        var positions = [];
        var height = el.clientHeight + this.gutter;
        var width = this.getColumnsFromWidth(el.clientWidth);
        var max = columns.length - width + 1;
        for (var index = 0; index < max; index++) {
            columns[index].getAllPositions(width, height, positions);
        }
        positions.sort(function (a, b) {
            if (a.y != b.y)
                return a.y - b.y;
            if (a.x == b.x)
                return 0;
            return a.x - b.x;
        });
        var result = positions[0];
        return result ? columns[result.x].reserve(result) : null;
    };
    ColumnPacking.prototype.getColumnCount = function (masonry) {
        var columnCount = this.columnCount;
        return typeof columnCount === 'number' ? columnCount : columnCount(masonry);
    };
    ColumnPacking.prototype.getColumnsFromWidth = function (width) {
        var _a = this, columns = _a.columns, columnWidth = _a.columnWidth;
        var max = Math.min(columns.length - 1);
        return clamp(Math.round(width / columnWidth), 1, max);
    };
    ColumnPacking.prototype.getMaxHeight = function () {
        var _a = this, columns = _a.columns, gutter = _a.gutter;
        var height = columns.reduce(function (height, column) { return Math.max(height, column.getMaxHeight()); }, 0);
        return height - gutter;
    };
    ColumnPacking.prototype.place = function (el) {
        var _a = this, columnWidth = _a.columnWidth, gutter = _a.gutter;
        var position = this.findPosition(el);
        var style = {};
        if (position) {
            style.position = 'absolute';
            style.top = position.y + "px";
            style.left = position.x * (columnWidth + gutter) + "px";
        }
        else {
            style.visibility = 'hidden';
        }
        return { el: el, style: style };
    };
    ColumnPacking.prototype.reset = function (masonry) {
        var gutter = this.gutter;
        var count = this.getColumnCount(masonry);
        var width = masonry.container.offsetWidth;
        if (this.columns.length === count && this.width === width) {
            return false;
        }
        var columns = [];
        for (var index = count - 1; index >= 0; index--) {
            columns[index] = new Column(index, columns[index + 1] || null);
        }
        this.columns = columns;
        this.columnWidth = (width - gutter * (count - 1)) / count;
        this.width = width;
        return true;
    };
    return ColumnPacking;
}());
export { ColumnPacking };
