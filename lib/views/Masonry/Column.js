var Column = /** @class */ (function () {
    function Column(index, next) {
        this.reserved = [];
        this.index = index;
        this.next = next;
    }
    Column.prototype.getAllPositions = function (columns, height, result) {
        var _this = this;
        if (result === void 0) { result = []; }
        var next = this.next;
        this.walk(columns, function (min, max) {
            if (max - min < height ||
                (columns > 1 && (!next || !next.isFree(columns - 1, height, min)))) {
                return;
            }
            result.push({
                width: columns,
                height: height,
                x: _this.index,
                y: min,
            });
        });
        return result;
    };
    Column.prototype.getMaxHeight = function (columns) {
        if (columns === void 0) { columns = 1; }
        var _a = this, next = _a.next, reserved = _a.reserved;
        var length = reserved.length;
        var max;
        if (length == 0) {
            max = 0;
        }
        else {
            max = reserved[length - 1].max;
        }
        if (next && columns > 1) {
            return Math.max(max, next.getMaxHeight(columns - 1));
        }
        else {
            return max;
        }
    };
    Column.prototype.isFree = function (columns, height, offset) {
        var _a = this, next = _a.next, reserved = _a.reserved;
        if ((columns > 1 && (!next || !next.isFree(columns - 1, height, offset))) ||
            !reserved.every(function (_a) {
                var max = _a.max, min = _a.min;
                return max <= offset || min >= offset + height;
            })) {
            return false;
        }
        return true;
    };
    Column.prototype.reserve = function (position) {
        var _a = this, next = _a.next, reserved = _a.reserved;
        var count = reserved.length - 1;
        var index = 0;
        reserved.push({
            min: position.y,
            max: position.y + position.height,
        });
        reserved.sort(function (a, b) {
            if (a.min === b.min)
                return 0;
            return a.min > b.min ? 1 : -1;
        });
        while (index < count) {
            var a = reserved[index];
            var b = reserved[index + 1];
            if (Math.abs(a.max - b.min) < 0.5) {
                a.max = b.max;
                reserved.splice(index + 1, 1);
                count -= 1;
            }
            else {
                index += 1;
            }
        }
        if (this.index < position.x + position.width - 1 && next) {
            next.reserve(position);
        }
        return position;
    };
    Column.prototype.reset = function () {
        this.reserved.length = 0;
    };
    Column.prototype.walk = function (columns, callback) {
        var reserved = this.reserved;
        var count = reserved.length;
        if (count == 0) {
            return callback(0, Number.NaN);
        }
        var bottom = this.getMaxHeight(columns);
        var wasBottomVisited = false;
        var current;
        var next = reserved[0];
        for (var index = 0; index < count; index++) {
            current = next;
            if (index == 0 && current.min > 0) {
                if (bottom === 0) {
                    wasBottomVisited = true;
                }
                callback(0, current.min);
            }
            if (current.max == bottom) {
                wasBottomVisited = true;
            }
            if (index == count - 1) {
                callback(current.max, Number.NaN);
            }
            else {
                next = reserved[index + 1];
                callback(current.max, next.min);
            }
        }
        if (!wasBottomVisited) {
            callback(bottom, Number.NaN);
        }
    };
    return Column;
}());
export { Column };
