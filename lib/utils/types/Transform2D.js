var Transform2D = /** @class */ (function () {
    function Transform2D(x, y, scale, rotation) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (scale === void 0) { scale = 0; }
        if (rotation === void 0) { rotation = 0; }
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scale = 1;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = rotation;
    }
    Transform2D.prototype.multiply = function (other) {
        Transform2D.multiply(this, other, this);
        return this;
    };
    Transform2D.prototype.clone = function () {
        return new Transform2D(this.x, this.y, this.scale, this.rotation);
    };
    Transform2D.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
        this.scale = other.scale;
        this.rotation = other.rotation;
    };
    Transform2D.prototype.identity = function () {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.rotation = 0;
    };
    Transform2D.prototype.translate = function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    };
    Transform2D.identity = function () {
        return new Transform2D(0, 0, 1, 0);
    };
    Transform2D.multiply = function (a, b, out) {
        if (out === void 0) { out = new Transform2D(); }
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.rotation = a.rotation + b.rotation;
        out.scale = a.scale * b.scale;
        return out;
    };
    Transform2D.translation = function (x, y) {
        return new Transform2D(x, y, 1, 0);
    };
    return Transform2D;
}());
export { Transform2D };
