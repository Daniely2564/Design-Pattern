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

class LineToPointAdapter extends Array {
  constructor(line) {
    super();
    console.log(
      `${LineToPointAdapter.count++}: Generating point for line ${line} (no caching)`
    );

    let left = Math.min(line.start.x, line.end.x);
    let right = Math.max(line.start.x, line.end.x);
    let top = Math.min(line.start.y, line.end.y);
    let bottom = Math.max(line.start.y, line.end.y);

    if (right - left === 0) {
      for (let y = top; y <= bottom; ++y) {
        this.push(new Point(left, y));
      }
    } else if (line.end.y - line.start.y === 0) {
      for (let x = left; x <= right; ++x) {
        this.push(new Point(x, top));
      }
    }
  }
}
LineToPointAdapter.count = 0;

let drawPoints = function () {
  for (let vo of vectorObjects) {
    for (let line of vo) {
      let adapter = new LineToPointAdapter(line);
      adapter.forEach(drawPoint);
    }
  }
};
drawPoints();
drawPoints(); // What if we duplicate this method.
// It is problemetic because we are generating points twice. Not a good idea.
// As we see whenever we call LineToPointAdapter, what we do is we generate new Points
