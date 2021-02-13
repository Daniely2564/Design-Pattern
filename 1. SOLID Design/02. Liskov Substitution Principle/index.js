class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }
  toString() {
    return `${this.width}x${this.height}`;
  }
}

class Square extends Rectangle {
  constructor(size) {
    // This line of code can be very problemetic
    // Someone can change the height/width making it not a square
    super(size, size);
  }
}

let rc = new Rectangle(2, 3);

let sq = new Square(5);
sq.width = 10; // Not a square. But it should be a square.

// Dangerous way of Solving it
