export interface PointType {
  x: number;
  y: number;
}

export function length(point: PointType): number {
  const { x, y } = point;
  return Math.sqrt(x * x + y * y);
}

export default class Point implements PointType {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

  copyFrom(other: Point): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  length(): number {
    return length(this);
  }

  origin(): this {
    this.x = 0;
    this.y = 0;
    return this;
  }

  rotation(): number {
    return Math.atan2(this.y, this.x);
  }

  subtract(x: number, y: number) {
    this.x -= x;
    this.y -= y;
  }

  static origin(): Point {
    return new Point(0, 0);
  }
}
