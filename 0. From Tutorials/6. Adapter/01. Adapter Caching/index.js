require("./apply-string-hash");
const { Point, Line } = require("../utils");

class VectorObject extends Array {}

class VectorRectangle extends VectorObject {
  constructor(x, y, width, height) {
    super();
    this.push(new Line(new Point(x, y), new Point(x + width, y)));
    this.push(
      new Line(new Point(x + width, y), new Point(x + width, y + height))
    );
    this.push(new Line(new Point(x, y), new Point(x, y + height)));
    this.push(
      new Line(new Point(x, y + height), new Point(x + width, y + height))
    );
  }
}

let drawPoint = function (point) {
  process.stdout.write(".");
};

let vectorObjects = [
  new VectorRectangle(1, 1, 10, 10),
  new VectorRectangle(3, 3, 6, 6),
];

// We currently dont have any functions to draw vector objects.
// We need to transform every single line into a set of points.
// So here we create an adapter that converts a line into points.

class LineToPointAdapter {
  constructor(line) {
    this.hash = JSON.stringify(line).hashCode();
    if (LineToPointAdapter.cache[this.hash]) return;

    console.log(
      `${LineToPointAdapter.count++}: Generating point for line ${line} (no caching)`
    );

    let points = [];

    let left = Math.min(line.start.x, line.end.x);
    let right = Math.max(line.start.x, line.end.x);
    let top = Math.min(line.start.y, line.end.y);
    let bottom = Math.max(line.start.y, line.end.y);

    if (right - left === 0) {
      for (let y = top; y <= bottom; ++y) {
        points.push(new Point(left, y));
      }
    } else if (line.end.y - line.start.y === 0) {
      for (let x = left; x <= right; ++x) {
        points.push(new Point(x, top));
      }
    }

    LineToPointAdapter.cache[this.hash] = points;
  }

  get items() {
    return LineToPointAdapter.cache[this.hash];
  }
}
LineToPointAdapter.count = 0;
LineToPointAdapter.cache = {};

let drawPoints = function () {
  for (let vo of vectorObjects) {
    for (let line of vo) {
      let adapter = new LineToPointAdapter(line);
      adapter.items.forEach(drawPoint);
    }
  }
};
drawPoints();
drawPoints(); // <- How can we avoid creating new Points again
