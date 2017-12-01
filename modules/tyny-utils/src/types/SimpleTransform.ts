export interface SimpleTransformType {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default class SimpleTransform implements SimpleTransformType {
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

  multiply(other: SimpleTransformType): this {
    SimpleTransform.multiply(this, other, this);
    return this;
  }

  clone(): SimpleTransform {
    return new SimpleTransform(this.x, this.y, this.scale, this.rotation);
  }

  copyFrom(other: SimpleTransformType) {
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

  static identity(): SimpleTransform {
    return new SimpleTransform(0, 0, 1, 0);
  }

  static multiply(
    a: SimpleTransformType,
    b: SimpleTransformType,
    out: SimpleTransform = new SimpleTransform()
  ): SimpleTransform {
    out.x = a.x + b.x;
    out.y = a.x + b.y;
    out.rotation = a.rotation + b.rotation;
    out.scale = a.scale * b.scale;
    return out;
  }

  static translation(x: number, y: number): SimpleTransform {
    return new SimpleTransform(x, y, 1, 0);
  }
}
