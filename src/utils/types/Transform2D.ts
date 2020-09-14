export interface Transform2DType {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export class Transform2D implements Transform2DType {
  x: number = 0;
  y: number = 0;
  rotation: number = 0;
  scale: number = 1;

  constructor(
    x: number = 0,
    y: number = 0,
    scale: number = 0,
    rotation: number = 0
  ) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;
  }

  multiply(other: Transform2DType): this {
    Transform2D.multiply(this, other, this);
    return this;
  }

  clone(): Transform2D {
    return new Transform2D(this.x, this.y, this.scale, this.rotation);
  }

  copyFrom(other: Transform2DType) {
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

  translate(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }

  static identity(): Transform2D {
    return new Transform2D(0, 0, 1, 0);
  }

  static multiply(
    a: Transform2DType,
    b: Transform2DType,
    out: Transform2D = new Transform2D()
  ): Transform2D {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.rotation = a.rotation + b.rotation;
    out.scale = a.scale * b.scale;
    return out;
  }

  static translation(x: number, y: number): Transform2D {
    return new Transform2D(x, y, 1, 0);
  }
}
