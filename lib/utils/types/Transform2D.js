export class Transform2D {
    constructor(x = 0, y = 0, scale = 0, rotation = 0) {
        this.x = 0;
        this.y = 0;
        this.rotation = 0;
        this.scale = 1;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = rotation;
    }
    multiply(other) {
        Transform2D.multiply(this, other, this);
        return this;
    }
    clone() {
        return new Transform2D(this.x, this.y, this.scale, this.rotation);
    }
    copyFrom(other) {
        this.x = other.x;
        this.y = other.y;
        this.scale = other.scale;
        this.rotation = other.rotation;
    }
    identity() {
        this.x = 0;
        this.y = 0;
        this.scale = 1;
        this.rotation = 0;
    }
    translate(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    static identity() {
        return new Transform2D(0, 0, 1, 0);
    }
    static multiply(a, b, out = new Transform2D()) {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.rotation = a.rotation + b.rotation;
        out.scale = a.scale * b.scale;
        return out;
    }
    static translation(x, y) {
        return new Transform2D(x, y, 1, 0);
    }
}
