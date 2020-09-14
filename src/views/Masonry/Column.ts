export interface ColumnReservation {
  min: number;
  max: number;
}

export interface ColumnRegion {
  height: number;
  width: number;
  x: number;
  y: number;
}

export class Column {
  readonly index: number;
  readonly next: Column | null;
  readonly reserved: ColumnReservation[] = [];

  constructor(index: number, next: Column | null) {
    this.index = index;
    this.next = next;
  }

  getAllPositions(
    columns: number,
    height: number,
    result: ColumnRegion[] = []
  ): ColumnRegion[] {
    const { next } = this;

    this.walk(columns, (min, max) => {
      if (
        max - min < height ||
        (columns > 1 && (!next || !next.isFree(columns - 1, height, min)))
      ) {
        return;
      }

      result.push({
        width: columns,
        height,
        x: this.index,
        y: min,
      });
    });

    return result;
  }

  getMaxHeight(columns: number = 1): number {
    const { next, reserved } = this;
    const { length } = reserved;
    let max;

    if (length == 0) {
      max = 0;
    } else {
      max = reserved[length - 1].max;
    }

    if (next && columns > 1) {
      return Math.max(max, next.getMaxHeight(columns - 1));
    } else {
      return max;
    }
  }

  isFree(columns: number, height: number, offset: number): boolean {
    const { next, reserved } = this;
    if (
      (columns > 1 && (!next || !next.isFree(columns - 1, height, offset))) ||
      !reserved.every(({ max, min }) => max <= offset || min >= offset + height)
    ) {
      return false;
    }

    return true;
  }

  reserve(position: ColumnRegion): ColumnRegion {
    const { next, reserved } = this;
    let count = reserved.length - 1;
    let index = 0;

    reserved.push({
      min: position.y,
      max: position.y + position.height,
    });

    reserved.sort((a, b) => {
      if (a.min === b.min) return 0;
      return a.min > b.min ? 1 : -1;
    });

    while (index < count) {
      const a = reserved[index];
      const b = reserved[index + 1];

      if (Math.abs(a.max - b.min) < 0.5) {
        a.max = b.max;
        reserved.splice(index + 1, 1);
        count -= 1;
      } else {
        index += 1;
      }
    }

    if (this.index < position.x + position.width - 1 && next) {
      next.reserve(position);
    }

    return position;
  }

  reset() {
    this.reserved.length = 0;
  }

  walk(columns: number, callback: (min: number, max: number) => void) {
    const { reserved } = this;
    const count = reserved.length;
    if (count == 0) {
      return callback(0, Number.NaN);
    }

    const bottom = this.getMaxHeight(columns);
    let wasBottomVisited = false;
    let current: ColumnReservation;
    let next: ColumnReservation = reserved[0];

    for (let index = 0; index < count; index++) {
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
      } else {
        next = reserved[index + 1];
        callback(current.max, next.min);
      }
    }

    if (!wasBottomVisited) {
      callback(bottom, Number.NaN);
    }
  }
}
