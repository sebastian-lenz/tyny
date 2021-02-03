export interface IntervalType {
  max: number;
  min: number;
}

export default class Interval implements IntervalType {
  max: number;
  min: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  getLength(): number {
    return this.max - this.min;
  }

  intersects(other: IntervalType): boolean {
    return this.max > other.min && this.min < other.max;
  }
}
