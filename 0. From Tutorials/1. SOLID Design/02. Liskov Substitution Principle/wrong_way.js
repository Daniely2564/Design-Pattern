class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  set width(value) {
    this._width = value;
  }
  set height(value) {
    this._height = value;
  }

  get area() {
    return this._width * this._height;
  }
  toString() {
    return `${this._width}x${this._height}`;
  }
}

class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  set width(value) {
    this._width = this._height = value;
  }

  set height(value) {
    this._width = this._height = value;
  }
}

let sq = new Square(5);
console.log(sq.toString());
sq.width = 10;
console.log(sq.toString());

// It seems to be a good way of doing this.
// What is the problem ?

// It works completely well with the base class, Rectangle but it fails to derive

// An Example would be.

let useIt = function (rc) {
  let width = rc._width;
  rc.height = 10;
  // My assumption is that it is 10 * width
  console.log(`Expected area of ${10 * width}`);
  console.log(`But got area of ${rc.area}`);
};

let rc = new Rectangle(2, 3);
useIt(rc);

sq = new Square(5);
console.log(sq.width);
useIt(sq);
// As soon as we set height, the width has changed to the height
// We would probs create another class for square instead of inheriting.
