class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  toString() {
    return `${this.start}->${this.end}`;
  }
}

exports.Point = Point;
exports.Line = Line;
